class GreenyPeakStuff {
    getInfo() {
        return {
            id: 'greenypeakstuff',
            name: 'Greeny Peak Stuff',

            color1: '#21E735',
            color2: '#F1FF71',
            color3: '#2B8A2F',

            blocks: [

                {
                    opcode: 'playerName',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'player name'
                },

                {
                    opcode: 'gameName',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'game name'
                },

                {
                    opcode: 'gameProperty',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[PROPERTY] of game',
                    arguments: {
                        PROPERTY: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'gameProperties'
                        }
                    }
                },

                {
                    opcode: 'textBetween',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '[TEXT] is between [X] and [Y]?',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '5'
                        },
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },

                {
                    opcode: 'browserName',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'browser name'
                },

                {
                    opcode: 'batteryLevel',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'battery level'
                },

                {
                    opcode: 'currentTime',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'current time'
                },

                {
                    opcode: 'computerLanguage',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'computer language'
                },

                {
                    opcode: 'categoryReporter',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[CATEGORY]',
                    arguments: {
                        CATEGORY: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'categories'
                        }
                    }
                },

                {
                    opcode: 'createType',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create [TYPE] named [NAME]',
                    arguments: {
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'types'
                        },
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'New Object'
                        }
                    }
                }

            ],

            menus: {

                gameProperties: {
                    acceptReporters: true,
                    items: [
                        'creator',
                        'release date',
                        'url',
                        'description'
                    ]
                },

                categories: {
                    acceptReporters: true,
                    items: [
                        'beat',
                        'effect',
                        'melody',
                        'vocal',
                        'bonus',
                        'extra',
                        'allstar'
                    ]
                },

                types: {
                    acceptReporters: true,
                    items: [
                        'slot',
                        'icon',
                        'loop',
                        'character',
                        'button'
                    ]
                }

            }
        };
    }

    playerName() {
        const link = document.querySelector('.user_menu a');
        return link ? link.textContent.trim() : 'Unknown';
    }

    gameName() {
        const title = document.querySelector('h1');
        return title ? title.textContent.trim() : 'Unknown';
    }

    gameProperty(args) {
        return `Property: ${args.PROPERTY}`;
    }

    textBetween(args) {
        const num = Number(args.TEXT);
        return num >= args.X && num <= args.Y;
    }

    browserName() {
        const ua = navigator.userAgent;

        if (ua.includes('Edg')) return 'Microsoft Edge';
        if (ua.includes('Chrome')) return 'Google Chrome';
        if (ua.includes('Firefox')) return 'Mozilla Firefox';
        if (ua.includes('Safari')) return 'Safari';

        return 'Unknown Browser';
    }

    batteryLevel() {
        return 'Battery API not loaded';
    }

    currentTime() {
        return new Date().toLocaleTimeString();
    }

    computerLanguage() {
        return navigator.language;
    }

    categoryReporter(args) {
        return args.CATEGORY;
    }

    createType(args) {
        console.log(
            `Created ${args.TYPE}: ${args.NAME}`
        );
    }
}

Scratch.extensions.register(new GreenyPeakStuff());