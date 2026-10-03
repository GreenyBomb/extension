(function(Scratch) {
    'use strict';
    const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMjguMDI2MDIiIGhlaWdodD0iMTI4LjAyNjAyIiB2aWV3Qm94PSIwLDAsMTI4LjAyNjAyLDEyOC4wMjYwMiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3NS45ODY5OSwtMTE1Ljk4Njk5KSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMTc1Ljk4Njk5LDE4MGMwLC0zNS4zNTM0MSAyOC42NTk2MSwtNjQuMDEzMDEgNjQuMDEzMDEsLTY0LjAxMzAxYzM1LjM1MzQxLDAgNjQuMDEzMDEsMjguNjU5NjEgNjQuMDEzMDEsNjQuMDEzMDFjMCwzNS4zNTM0MSAtMjguNjU5NjEsNjQuMDEzMDEgLTY0LjAxMzAxLDY0LjAxMzAxYy0zNS4zNTM0MSwwIC02NC4wMTMwMSwtMjguNjU5NjEgLTY0LjAxMzAxLC02NC4wMTMwMXoiIGZpbGw9IiMxM2JmMzQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0xODIuMDM3OCwxODBjMCwtMzIuMDExNjQgMjUuOTUwNTcsLTU3Ljk2MjIgNTcuOTYyMiwtNTcuOTYyMmMzMi4wMTE2NCwwIDU3Ljk2MjIsMjUuOTUwNTcgNTcuOTYyMiw1Ny45NjIyYzAsMzIuMDExNjQgLTI1Ljk1MDU3LDU3Ljk2MjIgLTU3Ljk2MjIsNTcuOTYyMmMtMzIuMDExNjQsMCAtNTcuOTYyMiwtMjUuOTUwNTcgLTU3Ljk2MjIsLTU3Ljk2MjJ6IiBmaWxsPSIjMGRmMjBjIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjg4Ljg4MzgyLDE4Ni43Mzk2NmMwLDE5LjQ4MzMgLTE1Ljc5NDM0LDM1LjI3NzY0IC0zNS4yNzc2NCwzNS4yNzc2NGMtMTkuNDgzMywwIC0zNS4yNzc2NCwtMTUuNzk0MzQgLTM1LjI3NzY0LC0zNS4yNzc2NGMwLC0xOS40ODMzIDE1Ljc5NDM0LC0zNS4yNzc2NCAzNS4yNzc2NCwtMzUuMjc3NjRjMTkuNDgzMywwIDM1LjI3NzY0LDE1Ljc5NDM0IDM1LjI3NzY0LDM1LjI3NzY0eiIgZmlsbD0iIzBkZjIwYyIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyMS4zMzU2MSwxNzIuMjAzNjNsLTUuOTYzNjQsLTEwLjc0MjExbDE5LjQ0MzgxLC0xNi42MjQ5OGw5LjM1Mjg0LDYuODg0ODYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjI3Ljg3NzY4LDE0OC45NjMwMmMtMS40MTM2MywtMS4zMzA4MSAtOS4zOTk3MSwtMTMuOTk3MDYgLTE3LjUxMTI2LC0xMC4zMTAxNGMtNC45MDQ2NiwyLjIyOTMgLTIuMTE0NjgsNy44MzI0IC02LjYzMjQ2LDExLjg2Nzc3Yy00LjUxNzc4LDQuMDM1MzcgLTEyLjI4ODkxLDIuMjk3NTEgLTEyLjU5NDYzLDIuNjU2MDJjLTAuMjM5MSwwLjI4MDM4IDEuNDAzMDksMS4zMDAxOSAzLjU3MDgzLDEuNjYwOTNjMS40MjgwNSwwLjIzNzY1IDMuNjU1NDMsLTAuMTI5ODIgMy42OTg5OSwtMC4wNTIzOGMwLjEwNjczLDAuMTg5NzYgLTAuOTI4OTQsMS4xNDA1NCAtMi4zMDM0OSwxLjg4MTdjLTEuNDM3NTEsMC43NzUxMSAtMy4yMjIwMSwxLjM0MzIxIC0zLjM1MjU5LDEuNjEyNDljLTAuMTI5NjEsMC4yNjcyNyAxLjQ3NzksMS40ODg0IDMuMzMwNywxLjY0OTc2YzIuNDQyOTgsMC4yMTI3NyA1LjMxMjQxLC0wLjY3MTUzIDUuMTg4NTksLTAuNjIzMjljLTEuNTQyNTUsMC42MDEgLTQuOTIwMDksMy44Mzg2MSAtNC44Nzc3Myw0LjA2MTUyYzAuMTA1NDQsMC41NTQ5OCAzLjYwMzM0LDAuMTQ2MzQgNC4wNjk3NywwLjA2OTQyYzMuNTg4MzUsLTAuNTkxNzIgOC41Mzk1MSwtMy42NTk4NCA5LjkwMDc3LC03LjE4Nzc4YzAuNzk3MTYsLTIuMDY1OTcgNS42NjcyMywtMTEuNTU1MDUgMTAuOTAwMDEsLTQuMjY4MTgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L2c+PC9nPjwvc3ZnPg==';

    class GreenyBlocks {
        getInfo() {
            return {
                id: 'greenyblocks',
                name: 'Greeny Blocks',
                color1: '#0df20c',
                color2: '#13bf34',
                menuIconURI: menuIconURI, 
                blockIconURI: null,        
                blocks: [
                    // --- COMMAND BLOCKS ---
                    {
                        opcode: 'copyText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'copy text [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello'
                            }
                        }
                    },

                    // --- CIRCLE BLOCKS (REPORTERS) ---
                    {
                        opcode: 'computerTime',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'computer time'
                    },
                    {
                        opcode: 'computerLanguage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'computer language'
                    },
                    {
                        opcode: 'randomLetter',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'random letter in [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Apple'
                            }
                        }
                    },
                    {
                        opcode: 'isBetween',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[NUM] is between [MIN] and [MAX]?',
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            },
                            MIN: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            MAX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: 'inlineIf',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'if [CONDITION]',
                        arguments: {
                            CONDITION: {
                                type: Scratch.ArgumentType.BOOLEAN
                            }
                        }
                    },

                    // --- TRIANGLE BLOCKS (BOOLEANS COM ENTRADAS DIGITÁVEIS) ---
                    {
                        opcode: 'andBoolean',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '[A] and [B]',
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'orBoolean',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '[A] or [B]',
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'notBoolean',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'not [A]',
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'yesBoolean',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'yes [A]',
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    // --- TRIANGLE BLOCK (ENTRADA BOOLEANA NÃO DIGITÁVEL) ---
                    {
                        opcode: 'yesCondition',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'yes [CONDITION]',
                        arguments: {
                            CONDITION: {
                                type: Scratch.ArgumentType.BOOLEAN
                            }
                        }
                    }
                ]
            };
        }

        // --- Executores dos Blocos ---
        copyText(args) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(String(args.TEXT));
            }
        }

        computerTime() {
            return new Date().toLocaleTimeString();
        }

        computerLanguage() {
            return navigator.language || 'en-US';
        }

        randomLetter(args) {
            const str = String(args.TEXT);
            if (!str) return '';
            return str[Math.floor(Math.random() * str.length)];
        }

        isBetween(args) {
            const num = Number(args.NUM);
            return num >= Number(args.MIN) && num <= Number(args.MAX);
        }

        inlineIf(args) {
            return Boolean(args.CONDITION);
        }

        andBoolean(args) {
            return Boolean(Number(args.A)) && Boolean(Number(args.B));
        }

        orBoolean(args) {
            return Boolean(Number(args.A)) || Boolean(Number(args.B));
        }

        notBoolean(args) {
            return !Boolean(Number(args.A));
        }

        yesBoolean(args) {
            return Boolean(Number(args.A));
        }

        yesCondition(args) {
            return Boolean(args.CONDITION);
        }
    }

    Scratch.extensions.register(new GreenyBlocks());
})(Scratch);