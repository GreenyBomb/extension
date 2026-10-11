(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Audio Visualizer must be loaded unsandboxed.');
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const renderer = vm.renderer || runtime.renderer;
  const Cast = Scratch.Cast;

  const CANVAS_WIDTH = 480;
  const CANVAS_HEIGHT = 360;
  const MIN_BARS = 4;
  const MAX_BARS = 180;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  class AudioVisualizer {
    constructor() {
      this.barCount = 72;
      this.color = '#FFFFFF';
      this.ghost = 0;
      this.x = 0;
      this.y = 0;
      this.scale = 100;
      this.visible = true;

      this.canvas = document.createElement('canvas');
      this.canvas.width = CANVAS_WIDTH;
      this.canvas.height = CANVAS_HEIGHT;
      this.ctx = this.canvas.getContext('2d');

      this.values = new Array(this.barCount).fill(0);
      this.skinId = null;
      this.drawableId = null;
      this.layerGroup = null;

      this.audioContext = null;
      this.inputNode = null;
      this.analyser = null;
      this.timeData = null;

      this.rafId = null;
      this._ensureDrawable();
      this._connectAnalyser();
      this._drawFrame();
      this._startLoop();

      if (runtime && typeof runtime.on === 'function') {
        runtime.on('PROJECT_STOP_ALL', () => {
          this.values.fill(0);
          this._drawFrame();
        });
      }
    }

    getInfo() {
      return {
        id: 'soundwavevisualizer',
        name: 'Audio Visualizer',
        color1: '#3B9D63',
        color2: '#2F8551',
        color3: '#FFFFFF',
        blocks: [
          {
            opcode: 'show',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show audio visualizer'
          },
          {
            opcode: 'hide',
            blockType: Scratch.BlockType.COMMAND,
            text: 'hide audio visualizer'
          },
          {
            opcode: 'setBars',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer bars to [BARS]',
            arguments: {
              BARS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 72
              }
            }
          },
          {
            opcode: 'setColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer color to [COLOR]',
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#FFFFFF'
              }
            }
          },
          {
            opcode: 'setGhost',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer ghost to [GHOST]',
            arguments: {
              GHOST: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer x [X] y [Y]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setScale',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer size to [SIZE]%',
            arguments: {
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          {
            opcode: 'getBars',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer bars'
          },
          {
            opcode: 'getGhost',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer ghost'
          }
        ]
      };
    }

    show() {
      this.visible = true;
      this._ensureDrawable();
      this._connectAnalyser();
      this._resumeAudio();
      this._updateDrawableProperties();
      this._startLoop();
    }

    hide() {
      this.visible = false;
      this._updateDrawableProperties();
      this._stopLoop();
    }

    setBars(args) {
      const bars = Math.round(clamp(Cast.toNumber(args.BARS), MIN_BARS, MAX_BARS));
      if (bars === this.barCount) return;

      const oldValues = this.values;
      this.barCount = bars;
      this.values = new Array(this.barCount).fill(0);

      for (let i = 0; i < this.barCount; i++) {
        const oldIndex = Math.floor(i * oldValues.length / this.barCount);
        this.values[i] = oldValues[oldIndex] || 0;
      }

      this._drawFrame();
    }

    setColor(args) {
      this.color = this._normalizeColor(Cast.toString(args.COLOR));
      this._drawFrame();
    }

    setGhost(args) {
      this.ghost = clamp(Cast.toNumber(args.GHOST), 0, 100);
      this._updateDrawableProperties();
    }

    setPosition(args) {
      this.x = clamp(Cast.toNumber(args.X), -240, 240);
      this.y = clamp(Cast.toNumber(args.Y), -180, 180);
      this._updateDrawableProperties();
    }

    setScale(args) {
      this.scale = clamp(Cast.toNumber(args.SIZE), 1, 300);
      this._updateDrawableProperties();
    }

    getBars() {
      return this.barCount;
    }

    getGhost() {
      return this.ghost;
    }

    _ensureDrawable() {
      if (!renderer || this.drawableId !== null) return;

      this.layerGroup = this._pickLayerGroup();
      this.skinId = renderer.createBitmapSkin(
        this.canvas,
        1,
        [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2]
      );
      this.drawableId = renderer.createDrawable(this.layerGroup);

      if (this.drawableId === undefined || this.drawableId === null) {
        this.drawableId = null;
        return;
      }

      renderer.updateDrawableSkinId(this.drawableId, this.skinId);
      this._updateDrawableProperties();

      if (typeof renderer.setDrawableOrder === 'function') {
        renderer.setDrawableOrder(this.drawableId, Infinity, this.layerGroup);
      }
    }

    _pickLayerGroup() {
      const layerGroups = renderer && renderer._layerGroups ? renderer._layerGroups : {};
      const names = Object.keys(layerGroups);
      for (const group of ['sprite', 'pen', 'video']) {
        if (Object.prototype.hasOwnProperty.call(layerGroups, group)) {
          return group;
        }
      }
      return names[names.length - 1] || 'sprite';
    }

    _updateDrawableProperties() {
      if (!renderer || this.drawableId === null) return;
      renderer.updateDrawableVisible(this.drawableId, this.visible);
      renderer.updateDrawablePosition(this.drawableId, [this.x, this.y]);
      renderer.updateDrawableScale(this.drawableId, [this.scale, this.scale]);
      renderer.updateDrawableEffect(this.drawableId, 'ghost', this.ghost);
      this._requestRedraw();
    }

    _connectAnalyser() {
      const audioEngine = runtime && runtime.audioEngine;
      if (!audioEngine) return false;

      const audioContext = audioEngine.audioContext || audioEngine.context;
      const inputNode = audioEngine.inputNode ||
        (typeof audioEngine.getInputNode === 'function' && audioEngine.getInputNode());

      if (!audioContext || !inputNode || typeof audioContext.createAnalyser !== 'function') {
        return false;
      }

      if (this.analyser && this.audioContext === audioContext && this.inputNode === inputNode) {
        return true;
      }

      if (this.analyser && this.inputNode) {
        try {
          this.inputNode.disconnect(this.analyser);
        } catch (e) {
          // It is fine if a previous analyser was already disconnected.
        }
      }

      this.audioContext = audioContext;
      this.inputNode = inputNode;
      this.analyser = audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.68;
      this.timeData = new Uint8Array(this.analyser.fftSize);

      try {
        inputNode.connect(this.analyser);
      } catch (e) {
        this.analyser = null;
        this.timeData = null;
        return false;
      }

      return true;
    }

    _resumeAudio() {
      if (
        this.audioContext &&
        this.audioContext.state === 'suspended' &&
        typeof this.audioContext.resume === 'function'
      ) {
        this.audioContext.resume().catch(() => {});
      }
    }

    _startLoop() {
      if (this.rafId !== null) return;

      const tick = () => {
        this.rafId = requestAnimationFrame(tick);
        this._sampleAudio();
        this._drawFrame();
      };

      this.rafId = requestAnimationFrame(tick);
    }

    _stopLoop() {
      if (this.rafId === null) return;
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    _sampleAudio() {
      if (!this._connectAnalyser() || !this.timeData) {
        for (let i = 0; i < this.values.length; i++) {
          this.values[i] *= 0.82;
        }
        return;
      }

      this.analyser.getByteTimeDomainData(this.timeData);

      let loudness = 0;
      for (let i = 0; i < this.timeData.length; i++) {
        const centered = (this.timeData[i] - 128) / 128;
        loudness += centered * centered;
      }
      loudness = Math.sqrt(loudness / this.timeData.length);

      const isQuiet = loudness < 0.012;
      const dataLength = this.timeData.length;

      for (let bar = 0; bar < this.barCount; bar++) {
        const start = Math.floor(bar * dataLength / this.barCount);
        const end = Math.max(start + 1, Math.floor((bar + 1) * dataLength / this.barCount));
        let total = 0;
        let peak = 0;

        for (let i = start; i < end; i++) {
          const amount = Math.abs((this.timeData[i] - 128) / 128);
          total += amount;
          if (amount > peak) peak = amount;
        }

        let target = ((total / (end - start)) * 0.65) + (peak * 0.35);
        target = Math.pow(clamp(target * 4.35, 0, 1), 0.78);
        if (isQuiet) target = 0;

        const attack = target > this.values[bar] ? 0.5 : 0.22;
        this.values[bar] += (target - this.values[bar]) * attack;
        if (isQuiet) this.values[bar] *= 0.82;
      }
    }

    _drawFrame() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const margin = 36;
      const usableWidth = CANVAS_WIDTH - (margin * 2);
      const slot = usableWidth / this.barCount;
      const lineWidth = clamp(slot * 0.46, 1.4, 6);
      const centerY = CANVAS_HEIGHT / 2;
      const maxHalfHeight = 82;

      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'butt';

      for (let i = 0; i < this.barCount; i++) {
        const value = this.values[i] || 0;
        if (value < 0.004) continue;

        const x = margin + (slot * i) + (slot / 2);
        const halfHeight = Math.max(3, value * maxHalfHeight);

        ctx.beginPath();
        ctx.moveTo(x, centerY - halfHeight);
        ctx.lineTo(x, centerY + halfHeight);
        ctx.stroke();
      }

      ctx.restore();

      if (renderer && this.skinId !== null) {
        renderer.updateBitmapSkin(
          this.skinId,
          this.canvas,
          1,
          [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2]
        );
        this._requestRedraw();
      }
    }

    _requestRedraw() {
      if (runtime && typeof runtime.requestRedraw === 'function') {
        runtime.requestRedraw();
      } else if (renderer && typeof renderer.draw === 'function') {
        renderer.draw();
      }
    }

    _normalizeColor(value) {
      const text = String(value || '').trim();
      const shortHex = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
      const longHex = /^#[0-9a-f]{6}$/i;

      if (longHex.test(text)) {
        return text.toUpperCase();
      }

      const shortMatch = text.match(shortHex);
      if (shortMatch) {
        return `#${shortMatch[1]}${shortMatch[1]}${shortMatch[2]}${shortMatch[2]}${shortMatch[3]}${shortMatch[3]}`.toUpperCase();
      }

      return '#FFFFFF';
    }
  }

  Scratch.extensions.register(new AudioVisualizer());
})(Scratch);
