(function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Soundwave Visualizer must be loaded unsandboxed.');
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const renderer = vm.renderer || runtime.renderer;
  const Cast = Scratch.Cast;

  const CANVAS_WIDTH = 480;
  const CANVAS_HEIGHT = 360;
  const MIN_BARS = 4;
  const MAX_BARS = 180;
  const MIN_GRADIENT_COLORS = 2;
  const MAX_GRADIENT_COLORS = 8;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  class SoundwaveVisualizer {
    constructor() {
      this.barCount = 72;
      this.color = '#FFFFFF';
      this.ghost = 0;
      this.x = 0;
      this.y = 0;
      this.scale = 100;
      this.visible = true;
      this.direction = 0;
      this.shape = 'bars';
      this.useGradient = false;
      this.gradientType = 'top-down';
      this.gradientColors = ['#30c260', '#00802b', '#ffffff', '#00ff88', '#00cc66', '#009944', '#006622', '#003311'];
      this.gradientColorCount = 2;

      this.canvas = document.createElement('canvas');
      this.canvas.width = CANVAS_WIDTH;
      this.canvas.height = CANVAS_HEIGHT;
      this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';

      this.values = new Array(this.barCount).fill(0);
      this.skinId = null;
      this.drawableId = null;
      this.layerGroup = null;
      this.audioContext = null;
      this.inputNode = null;
      this.analyser = null;
      this.timeData = null;
      this.rafId = null;
      this._cachedGradient = null;
      this._gradientDirty = true;

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
        name: 'Soundwave Visualizer',
        color1: '#30c260',
        color2: '#00802b',
        color3: '#00802b',
        menuIconURI: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwLDAsMTI4LDEyOCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3NiwtMTE2KSI+PGcgc3Ryb2tlPSJub25lIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0xNzYsMTgwYzAsLTM1LjM0NjIyIDI4LjY1Mzc4LC02NCA2NCwtNjRjMzUuMzQ2MjIsMCA2NCwyOC42NTM3OCA2NCw2NGMwLDM1LjM0NjIyIC0yOC42NTM3OCw2NCAtNjQsNjRjLTM1LjM0NjIyLDAgLTY0LC0yOC42NTM3OCAtNjQsLTY0eiIgZmlsbD0iIzAwODAyYiIgc3Ryb2tlLXdpZHRoPSJOYU4iLz48cGF0aCBkPSJNMTg0LjIzODEsMTgwYzAsLTMwLjc5NjQ1IDI0Ljk2NTQ2LC01NS43NjE5IDU1Ljc2MTksLTU1Ljc2MTljMzAuNzk2NDUsMCA1NS43NjE5LDI0Ljk2NTQ2IDU1Ljc2MTksNTUuNzYxOWMwLDMwLjc5NjQ1IC0yNC45NjU0Niw1NS43NjE5IC01NS43NjE5LDU1Ljc2MTljLTMwLjc5NjQ1LDAgLTU1Ljc2MTksLTI0Ljk2NTQ2IC01NS43NjE5LC01NS43NjE5eiIgZmlsbD0iIzMwYzI2MCIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTE5Ny43MTA5NSwyMTkuNzgwNDZoNC44Nzg2NHYxMC42OTc4OWMtMC4yMjE0NSwtMC4xMzg0OSAtMC40MDI0NywtMC4yNzMxMyAtMC41Mzk1NCwtMC40MDMzNWMtMS41NDM4MSwtMS40NjY1OCAtMi44OTM2NiwtMy4wNzU4MSAtNC4zMzkxLC00LjUwMDI3eiIgZmlsbC1vcGFjaXR5PSIwLjUwMTk2IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjA3LjQ1ODQ4LDE5MC4yMTI5NWg0Ljg3ODY0bDAsNDMuNjM3NjFjLTEuNzc3MTMsLTAuNDY5MyAtMy40MzA5NiwtMC45NDEyMyAtNC44Nzg2NCwtMS40MDIxOHoiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTIxNy4yMDYwMSwyMDAuNjEwMzFoNC44Nzg2NHYzNS41NDg3NGMtMS42Mjk4LC0wLjM1MDUgLTMuMjcxOTcsLTAuNzE4OSAtNC44Nzg2NCwtMS4wOTczNXoiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTIyNy42MDMzNywxOTguNjYwNzloNC44Nzg2NHYzOS41MjQ4NWMtMS40OTQyOCwtMC4yNTcwOSAtMy4xNDM0MiwtMC41NTk4MyAtNC44Nzg2NCwtMC44OTY5NHoiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTIzNy4zNTA5LDIxNC4yNTY4NWg0Ljg3ODY0djI0Ljg3MDFjLTEuMTY2MTQsMC4wNDA5MSAtMi4zMTM0NiwwLjAyNjE4IC0zLjQzOTMsLTAuMDUxOTZjLTAuMzg5NjMsLTAuMDI3MDQgLTAuODczODMsLTAuMDc2MzYgLTEuNDM5MzUsLTAuMTQ1Nzl6IiBmaWxsLW9wYWNpdHk9IjAuNTAxOTYiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNzcuNDEwNDEsMTk4LjIyNzU4aDQuODc4NjR2MjcuODU0OTZjLTEuMDk2MzYsMC44MjU4NiAtMi4wMTczNSwxLjg3MjA3IC0yLjY5NzE3LDMuMDcyODJjLTAuNzI0ODgsMC4yMTc0NCAtMS40NTIyLDAuNDQxNjEgLTIuMTgxNDcsMC42NzEwOXoiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI2Ny42NjI4OCwyMDMuODU5NDloNC44Nzg2NHYyNy41NTQ0N2MtMS42MjM3NiwwLjU0MzE4IC0zLjI1MTc0LDEuMDk2OTEgLTQuODc4NjQsMS42NDU4N3oiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI1Ny4yNjU1MSwxOTUuNjI4MjNoNC44Nzg2NHYzOS4yNTcxM2MtMS42MzUyMywwLjUyNDEzIC0zLjI2MzI2LDEuMDI1NjkgLTQuODc4NjQsMS40ODg4NXoiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI0Ny41MTc5OSwyMDcuNzU4NTFoNC44Nzg2NHYyOS44ODk2N2MtMS42NDc5MiwwLjM4Mzk0IC0zLjI3NjE3LDAuNzA4OTkgLTQuODc4NjQsMC45NTczOHoiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI4Mi4yODkwNSwxNjkuNzg3MDVoLTQuODc4NjR2LTM2LjI4NzNjMS40MjEwNSwwLjkxMDk5IDMuMDg3NzUsMS40NzIyOCA0Ljg3ODY0LDEuNTYyNDJ6IiBmaWxsLW9wYWNpdHk9IjAuNTAxOTYiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNzIuNTQxNTIsMTU5LjM4OTY5aC00Ljg3ODY0di0zMi4zMTk0OWwyLjIwNDQ0LDAuNzM0ODFsMC44ODU3MywwLjU5MDQ5bDAuMzc4OSwwLjEzNTMybDAuMTY4MSwwLjI5NDE3bDEuMjQxNDcsMC4zMTAzN3oiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI2Mi4xNDQxNiwxNjEuMzM5MmgtNC44Nzg2NHYtMzkuMTAxMTNsMS4wMDU1NSwwLjUwMjc4bDAuOTgxOTgsMC42NTQ2NmwvMC4zNzg5LDAuMTM1MzJsMC4xNjgxLDAuMjk0MTdsMS41MzIyNiwwLjM4MzA3bDAuODExODQsMC40ODcxMXoiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI1Mi4zOTY2MywxNDUuNzQzMTVoLTQuODc4NjRsMCwtMjYuMjIxMjVsMC4xMTk3OSwwLjAzOTkzbDEuNjAyNzcsMC4xMjMyOWwxLjU1OTUxLDAuMzg5ODhoMS4xOTY5N2wwLjM3NzY3LDAuMjAxNDNsMC4wMjE5MywwLjAwNTQ4eiIgZmlsbC1vcGFjaXR5PSIwLjUwMTk2IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjAyLjU4OTU5LDE0NS44NTE0NWgtNC44Nzg2NHYtOC4zNzQxM2wyLjA2MTI0LC0wLjQ1ODA1bDAuMjQ5MjIsLTAuMTI0NjFsMC4yNzg2NCwtMC4wNjk2NmwvMC4wNTU3MywtMC4wOTc1MmwwLjI5ODI5LC0wLjE0OTE0bDAuMTUyOTIsMC4wMTA1NWwxLjczMDU5LC0xLjU3MzI2bDAuMDUyMDIsLTAuMDEzeiIgZmlsbC1vcGFjaXR5PSIwLjUwMTk2IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjEyLjMzNzEyLDE2MS43NzI0MWgtNC44Nzg2NHYtMjkuMzYyMDJsMC4zNDE1OCwtMC4wODUzOWwwLjM3OTM4LC0wLjY2MzkybDAuOTU0MywtMC41NzI1OGwyLjEzODQ1LC0xLjA2OTIybDAuOTI2MTUsLTAuNzkzODRsMC4xMzg3OCwtMC4wMzQ3eiIgZmlsbC1vcGFjaXR5PSIwLjUwMTk2IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjIyLjA4NDY1LDE1Ni4xNDA1MWgtNC44Nzg2NHYtMjkuODk1MzhsMC4xNjUxMSwtMC4wOTkwN2wwLjI5OTgzLC0wLjI5OTgzbDAuNTY2MjMsLTAuMzc3NDhsMC4xNTMwNSwtMC4wMDg1bDEuNjA5MTMsLTEuODc3MzJsMS4yMjYwNiwtMC4zMDY1MWwwLjg1OTI0LC0wLjQ1ODI2eiIgZmlsbC1vcGFjaXR5PSIwLjUwMTk2IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjMyLjQ4MjAyLDE2NC4zNzE3NmgtNC44Nzg2NGwwLC00My41MTgwOGwwLjg2ODgyLC0wLjQzNDQxbDEuOCwtMC40bDAuMiwtMC4xbDEuMTQxNzEsLTAuMjUzNzFsMC44NjgxMiwtMC4wNjY3OHoiIGZpbGwtb3BhY2l0eT0iMC41MDE5NiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI0Mi4yMjk1NCwxNTIuMjQxNDloLTQuODc4NjRsMCwtMzMuMTY2NWg0Ljg3ODY0eiIgZmlsbC1vcGFjaXR5PSIwLjUwMTk2IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMTc2LDE4MGMwLC0zNS4zNDYyMiAyOC42NTM3OCwtNjQgNjQsLTY0YzM1LjM0NjIyLDAgNjQsMjguNjUzNzggNjQsNjRjMCwzNS4zNDYyMiAtMjguNjUzNzgsNjQgLTY0LDY0Yy0zNS4zNDYyMiwwIC02NCwtMjguNjUzNzggLTY0LC02NHpNMjQwLDIzNS43NjE5YzMwLjc5NjQ0LDAgNTUuNzYxOSwtMjQuOTY1NDUgNTUuNzYxOSwtNTUuNzYxOWMwLC0zMC43OTY0NCAtMjQuOTY1NDUsLTU1Ljc2MTkgLTU1Ljc2MTksLTU1Ljc2MTljLTMwLjc5NjQ0LDAgLTU1Ljc2MTksMjQuOTY1NDUgLTU1Ljc2MTksNTUuNzYxOWMwLDMwLjc5NjQ0IDI0Ljk2NTQ1LDU1Ljc2MTkgNTUuNzYxOSw1NS43NjE5eiIgZmlsbD0iIzAwODAyYiIgc3Ryb2tlLXdpZHRoPSJOYU4iLz48ZyBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMjA0LjcyNTQ0LDE2NS4yMjMwOWMyLjk2NDg1LDAgMTQuNjU0ODgsLTAuMzMyMjggMTQuNjU0ODgsLTAuMzMyMjhjMCwwIDE0LjI2OTE2LC0xNS4yMjY4NyAxOC4yNTQxNiwtMTguNzM3OWMxLjU3NzM2LC0xLjM4OTc1IDMuMzAyNjMsLTEuMTM0NDQgMy4zMDI2MywxLjg1MjgyYzAsMTQuMzUwMDEgMCw1Ni42NjUxMyAwLDY0LjQ3OTkxYzAsMi40Mjc3MiAtMS43MzMzLDIuODA0NDQgLTMuMjg0ODIsMS4yMTcwM2MtMy43NzA4MywtMy44NTgxNSAtMTguOTA0NzksLTE5LjM1NDQ2IC0xOC45MDQ3OSwtMTkuMzU0NDZjMCwwIC0xMC43OTUzNywwIC0xMy45OTA5NywwYy0xLjYwNzQ5LDAgLTMuOTU2MjQsLTEuOTgxMzYgLTMuOTU2MjQsLTQuMDE0NzRjMCwtNS43MTA2IDAsLTE2LjQwNzQyIDAsLTIwLjExNjg0YzAsLTIuMjg4MTEgMi4yNTIyOCwtNC45OTM1NiAzLjkyNTIsLTQuOTkzNTZ6IiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjQ4LjAzMDA4LDIwOS44NTE3MmMtMy43OTQwOCwtMy4wMzUyNyAwLjA2MzI5LC03LjYyOTgyIDAuMDYzMjksLTcuNjI5ODJjNS41NjM0LC0xMS45NTkwOSA3Ljk4MzM1LC0zMy4yNzY2OSAtMC41OTc2MywtNDQuNDE0YzAsMCAtMi44NTc3NiwtMy45Mjk0OCAxLjA3MTcyLC02Ljc4NzMxYzMuOTI5NDgsLTIuODU3ODIgNi43ODczMSwxLjA3MTY2IDYuNzg3MzEsMS4wNzE2NmMxMC4yOTA1NywxNC43MDM4NiA3Ljk2ODg0LDM5LjgyNDA0IDAuNzg0NDEsNTUuNDk3NTNjMCwwIC00LjMxNTA3LDUuMjk3MTQgLTguMTA5MDksMi4yNjE4N3oiIHN0cm9rZS13aWR0aD0iMC41Ii8+PHBhdGggZD0iTTI2NC45MTcwNywyMDkuODUxNjVjLTMuNzk0MDgsLTMuMDM1MjcgMC4wNjMzMiwtNy42Mjk3OSAwLjA2MzMyLC03LjYyOTc5YzUuNTYzNCwtMTEuOTU5MDYgNy45ODMzNSwtMzMuMjc2NjcgLTAuNTk3NjMsLTQ0LjQxNGMwLDAgLTIuODU3NzksLTMuOTI5NDggMS4wNzE2OSwtNi43ODczMWMzLjkyOTQ4LC0yLjg1NzgyIDYuNzg3MzEsMS4wNzE2OSA2Ljc4NzMxLDEuMDcxNjljMTAuMjkwNTcsMTQuNzAzODYgNy45Njg4NCwzOS44MjQwOCAwLjc4NDQ0LDU1LjQ5NzU2YzAsMCAtNC4zMTUwNSw1LjI5NzExIC04LjEwOTEzLDIuMjYxODR6IiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvZz48L2c+PC9nPjwvc3ZnPg==',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Made by @deathwishbydemo'
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Visibility & Events'
          },
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
            opcode: 'whenShown',
            blockType: Scratch.BlockType.HAT,
            text: 'when audio visualizer shown'
          },
          {
            opcode: 'whenHidden',
            blockType: Scratch.BlockType.HAT,
            text: 'when audio visualizer hidden'
          },
          {
            opcode: 'getVisible',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'visualizer visible?'
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Shape'
          },
          {
            opcode: 'setShape',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer shape to [SHAPE]',
            arguments: {
              SHAPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'shapeMenu',
                defaultValue: 'bars'
              }
            }
          },
          {
            opcode: 'getShape',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer shape'
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Bars'
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
            opcode: 'getBars',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer bars'
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Direction'
          },
          {
            opcode: 'setDirection',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer direction to [DIR]°',
            arguments: {
              DIR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'changeDirection',
            blockType: Scratch.BlockType.COMMAND,
            text: 'change visualizer direction by [DIR]°',
            arguments: {
              DIR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15
              }
            }
          },
          {
            opcode: 'getDirection',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer direction'
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Color'
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
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Gradient'
          },
          {
            opcode: 'setUseGradient',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer gradient [STATE]',
            arguments: {
              STATE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'onOffMenu',
                defaultValue: 'off'
              }
            }
          },
          {
            opcode: 'setGradientType',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set gradient type to [TYPE]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gradientTypeMenu',
                defaultValue: 'top-down'
              }
            }
          },
          {
            opcode: 'setGradientColorCount',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set gradient color count to [COUNT]',
            arguments: {
              COUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              }
            }
          },
          {
            opcode: 'setGradientColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set gradient color [INDEX] to [COLOR]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#30c260'
              }
            }
          },
          {
            opcode: 'getUseGradient',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'gradient enabled?'
          },
          {
            opcode: 'getGradientType',
            blockType: Scratch.BlockType.REPORTER,
            text: 'gradient type'
          },
          {
            opcode: 'getGradientColorCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'gradient color count'
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Position, Size & Ghost'
          },
          {
            opcode: 'setPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer x [X] y [Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setScale',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer size to [SIZE]%',
            arguments: {
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'setGhost',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visualizer ghost to [GHOST]',
            arguments: {
              GHOST: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'getX',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer x'
          },
          {
            opcode: 'getY',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer y'
          },
          {
            opcode: 'getSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer size'
          },
          {
            opcode: 'getGhost',
            blockType: Scratch.BlockType.REPORTER,
            text: 'visualizer ghost'
          }
        ],
        menus: {
          shapeMenu: {
            acceptReporters: true,
            items: [
              { text: 'bars', value: 'bars' },
              { text: 'circle', value: 'circle' }
            ]
          },
          gradientTypeMenu: {
            acceptReporters: true,
            items: [
              { text: 'top-down', value: 'top-down' },
              { text: 'left-right', value: 'left-right' },
              { text: 'radial', value: 'radial' }
            ]
          },
          onOffMenu: {
            acceptReporters: true,
            items: [
              { text: 'on', value: 'on' },
              { text: 'off', value: 'off' }
            ]
          }
        }
      };
    }

    show() {
      const wasVisible = this.visible;
      this.visible = true;
      this._ensureDrawable();
      this._connectAnalyser();
      this._resumeAudio();
      this._updateDrawableProperties();
      this._startLoop();
      if (!wasVisible) this._startHats('whenShown');
    }

    hide() {
      const wasVisible = this.visible;
      this.visible = false;
      this._updateDrawableProperties();
      this._stopLoop();
      if (wasVisible) this._startHats('whenHidden');
    }

    whenShown() { return false; }
    whenHidden() { return false; }

    _startHats(opcode) {
      if (runtime && typeof runtime.startHats === 'function') {
        runtime.startHats(`soundwavevisualizer_${opcode}`);
      }
    }

    setShape(args) {
      const s = Cast.toString(args.SHAPE).toLowerCase();
      this.shape = (s === 'circle') ? 'circle' : 'bars';
      this._gradientDirty = true;
      this._drawFrame();
    }
    getShape() { return this.shape; }

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
    getBars() { return this.barCount; }

    setDirection(args) {
      this.direction = Cast.toNumber(args.DIR) % 360;
      if (this.direction < 0) this.direction += 360;
      this._gradientDirty = true;
      this._drawFrame();
    }
    changeDirection(args) {
      this.direction = (this.direction + Cast.toNumber(args.DIR)) % 360;
      if (this.direction < 0) this.direction += 360;
      this._gradientDirty = true;
      this._drawFrame();
    }
    getDirection() { return this.direction; }

    setColor(args) {
      this.color = this._normalizeColor(Cast.toString(args.COLOR));
      this._drawFrame();
    }

    setUseGradient(args) {
      this.useGradient = Cast.toString(args.STATE).toLowerCase() === 'on';
      this._gradientDirty = true;
      this._drawFrame();
    }
    getUseGradient() { return this.useGradient; }

    setGradientType(args) {
      const t = Cast.toString(args.TYPE).toLowerCase();
      if (t === 'left-right' || t === 'radial') {
        this.gradientType = t;
      } else {
        this.gradientType = 'top-down';
      }
      this._gradientDirty = true;
      this._drawFrame();
    }
    getGradientType() { return this.gradientType; }

    setGradientColorCount(args) {
      this.gradientColorCount = Math.round(
        clamp(Cast.toNumber(args.COUNT), MIN_GRADIENT_COLORS, MAX_GRADIENT_COLORS)
      );
      this._gradientDirty = true;
      this._drawFrame();
    }
    getGradientColorCount() { return this.gradientColorCount; }

    setGradientColor(args) {
      const idx = Math.round(Cast.toNumber(args.INDEX)) - 1;
      if (idx < 0 || idx >= MAX_GRADIENT_COLORS) return;
      this.gradientColors[idx] = this._normalizeColor(Cast.toString(args.COLOR));
      this._gradientDirty = true;
      this._drawFrame();
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
    setGhost(args) {
      this.ghost = clamp(Cast.toNumber(args.GHOST), 0, 100);
      this._updateDrawableProperties();
    }
    getGhost() { return this.ghost; }
    getX() { return this.x; }
    getY() { return this.y; }
    getSize() { return this.scale; }
    getVisible() { return this.visible; }

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
        try { this.inputNode.disconnect(this.analyser); } catch (e) {}
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
      if (this.audioContext && this.audioContext.state === 'suspended' &&
          typeof this.audioContext.resume === 'function') {
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

    _createGradient(ctx) {
      if (!this._gradientDirty && this._cachedGradient) {
        return this._cachedGradient;
      }

      let grad;
      if (this.gradientType === 'radial') {
        const cx = CANVAS_WIDTH / 2;
        const cy = CANVAS_HEIGHT / 2;
        const r = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.55;
        grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      } else if (this.gradientType === 'left-right') {
        grad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
      } else {
        grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      }

      const count = this.gradientColorCount;
      for (let i = 0; i < count; i++) {
        const stop = count === 1 ? 0 : i / (count - 1);
        grad.addColorStop(stop, this.gradientColors[i] || '#FFFFFF');
      }

      this._cachedGradient = grad;
      this._gradientDirty = false;
      return grad;
    }

    _drawFrame() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Force high quality every frame
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const centerX = CANVAS_WIDTH / 2;
      const centerY = CANVAS_HEIGHT / 2;
      const margin = 36;
      const usableWidth = CANVAS_WIDTH - (margin * 2);
      const slot = usableWidth / this.barCount;
      const lineWidth = clamp(slot * 0.55, 2, 8); // slightly thicker for better quality
      const maxHalfHeight = 82;

      ctx.save();

      ctx.translate(centerX, centerY);
      ctx.rotate((this.direction * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      if (this.useGradient) {
        ctx.strokeStyle = this._createGradient(ctx);
      } else {
        ctx.strokeStyle = this.color;
      }
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round'; // round caps look cleaner
      ctx.lineJoin = 'round';

      if (this.shape === 'circle') {
        const innerRadius = 28;
        const maxBarLen = 110;
        const angleStep = (Math.PI * 2) / this.barCount;

        for (let i = 0; i < this.barCount; i++) {
          const value = this.values[i] || 0;
          if (value < 0.004) continue;

          const angle = i * angleStep - Math.PI / 2;
          const len = Math.max(4, value * maxBarLen);
          const x1 = centerX + Math.cos(angle) * innerRadius;
          const y1 = centerY + Math.sin(angle) * innerRadius;
          const x2 = centerX + Math.cos(angle) * (innerRadius + len);
          const y2 = centerY + Math.sin(angle) * (innerRadius + len);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      } else {
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
      if (longHex.test(text)) return text.toUpperCase();
      const shortMatch = text.match(shortHex);
      if (shortMatch) {
        return `#${shortMatch[1]}${shortMatch[1]}${shortMatch[2]}${shortMatch[2]}${shortMatch[3]}${shortMatch[3]}`.toUpperCase();
      }
      return '#FFFFFF';
    }
  }

  Scratch.extensions.register(new SoundwaveVisualizer());
})(Scratch);
