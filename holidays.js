(function(Scratch) {
  'use strict';

  // SVG de calendário/evento limpo e codificado corretamente em Base64
  const categoryIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMjguMDI2MDIiIGhlaWdodD0iMTI4LjAyNjAyIiB2aWV3Qm94PSIwLDAsMTI4LjAyNjAyLDEyOC4wMjYwMiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3NS45ODY5OSwtMTE1Ljk4Njk5KSI+PGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTE3NS45ODY5OSwxODBjMCwtMzUuMzUzNDEgMjguNjU5NjEsLTY0LjAxMzAxIDY0LjAxMzAxLC02NC4wMTMwMWMzNS4zNTM0MSwwIDY0LjAxMzAxLDI4LjY1OTYxIDY0LjAxMzAxLDY0LjAxMzAxYzAsMzUuMzUzNDEgLTI4LjY1OTYxLDY0LjAxMzAxIC02NC4wMTMwMSw2NC4wMTMwMWMtMzUuMzUzNDEsMCAtNjQuMDEzMDEsLTI4LjY1OTYxIC02NC4wMTMwMSwtNjQuMDEzMDF6IiBmaWxsPSIjYWQwNjA2IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0xODIuMDM3OCwxODBjMCwtMzIuMDExNjQgMjUuOTUwNTcsLTU3Ljk2MjIgNTcuOTYyMiwtNTcuOTYyMmMzMi4wMTE2NCwwIDU3Ljk2MjIsMjUuOTUwNTcgNTcuOTYyMiw1Ny45NjIyYzAsMzIuMDExNjQgLTI1Ljk1MDU3LDU3Ljk2MjIgLTU3Ljk2MjIsNTcuOTYyMmMtMzIuMDExNjQsMCAtNTcuOTYyMiwtMjUuOTUwNTcgLTU3Ljk2MjIsLTU3Ljk2MjJ6IiBmaWxsPSIjZmYyZDJkIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNzQuNzI2LDE5Ny4zMTQwM2MwLjQyNDQ2LDMuMDUzNDcgMS44ODM5Myw5LjUxNTIxIC0wLjE5MTM0LDEyLjIxMzE3Yy0yLjc0NTU3LDMuNTY5MzkgLTExLjA0NzkzLDQuMzU1NjUgLTE0Ljk5NDU4LDUuMzQyMzFjMCwwIC0xLjIyMzk4LDAuNDA5NzcgLTIuMTU4MzcsMS4wMzg0M2MtMy43MzU5MiwyLjUxMzU2IC01OC4xODQ2NiwtOC45ODA3NSAtNjEuMzM4MDMsLTEyLjg0Mzc1Yy0xLjUzNTEsLTEuODgwNTYgOS4wMjYzOSwtMzcuNDgxNTggMTQuMzEzOTUsLTQ3Ljc5NjRsLTEuMjUyMDMsLTAuMzg2NjVjLTIuOTQzNzQsLTEuNDg4NTUgLTEuMzQwMTcsLTEwLjY2MTY3IDMuMTIyNDEsLTExLjA2Mjg0YzEzLjQ0MzkzLC0xLjIwODU0IDY5LjEzNTkxLDExLjI5ODEgNzAuNjA0NTcsMTMuNjM4NTFjNC4zMjUxMyw2Ljg5MjM5IC0zLjIyNjc5LDE1LjU1OTMgLTkuNjQ5NDUsMTcuMTkxMjljLTAuMjI4NDEsNy44MDY1NSAwLjcxMjYzLDE2LjY5MzM5IDEuNTQyODYsMjIuNjY1OTN6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjA5LjgyNzg0LDE3OC40MDk5NmwxLjgzODM1LC03Ljc4NTkybDcuMDU1OTgsMS42NjZsLTEuODM4MzQsNy43ODU5MXoiIGZpbGw9IiNmZjJkMmQiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIwNy4zMjc4NCwxODguNDA5OTZsMS44MzgzNSwtNy43ODU5Mmw3LjA1NTk4LDEuNjY2bC0xLjgzODM0LDcuNzg1OTF6IiBmaWxsPSIjZmYyZDJkIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMDQuODI3ODQsMTk4LjE1OTk2bDEuODM4MzUsLTcuNzg1OTJsNy4wNTU5OCwxLjY2NmwtMS44MzgzNCw3Ljc4NTkxeiIgZmlsbD0iI2ZmMmQyZCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjIyLjMyNzg0LDE3MS40MDk5NmwxLjgzODM1LC03Ljc4NTkybDcuMDU1OTgsMS42NjZsLTEuODM4MzQsNy43ODU5MXoiIGZpbGw9IiNmZjJkMmQiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIxOS41Nzc4NCwxODEuMTU5OTZsMS44MzgzNSwtNy43ODU5Mmw3LjA1NTk4LDEuNjY2bC0xLjgzODM0LDcuNzg1OTF6IiBmaWxsPSIjZmYyZDJkIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMTcuMDc3ODQsMTkxLjE1OTk2bDEuODM4MzUsLTcuNzg1OTJsNy4wNTU5OCwxLjY2NmwtMS44MzgzNCw3Ljc4NTkxeiIgZmlsbD0iI2ZmMmQyZCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjE0LjU3Nzg0LDIwMC45MDk5NmwxLjgzODM1LC03Ljc4NTkybDcuMDU1OTgsMS42NjZsLTEuODM4MzQsNy43ODU5MXoiIGZpbGw9IiNmZjJkMmQiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzMi41Nzc4NCwxNzQuMTU5OTZsMS44MzgzNSwtNy43ODU5Mmw3LjA1NTk4LDEuNjY2bC0xLjgzODM0LDcuNzg1OTF6IiBmaWxsPSIjZmYyZDJkIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjkuODI3ODQsMTgzLjkwOTk2bDEuODM4MzUsLTcuNzg1OTJsNy4wNTU5OCwxLjY2NmwtMS44MzgzNCw3Ljc4NTkxeiIgZmlsbD0iI2ZmMmQyZCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjI3LjMyNzg0LDE5My45MDk5NmwxLjgzODM1LC03Ljc4NTkybDcuMDU1OTgsMS42NjZsLTEuODM4MzQsNy43ODU5MXoiIGZpbGw9IiNmZjJkMmQiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyNC44Mjc4NCwyMDMuNjU5OTZsMS44MzgzNSwtNy43ODU5Mmw3LjA1NTk4LDEuNjY2bC0xLjgzODM0LDcuNzg1OTF6IiBmaWxsPSIjZmYyZDJkIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNDIuMzI3ODQsMTc2LjY1OTk2bDEuODM4MzUsLTcuNzg1OTJsNy4wNTU5OCwxLjY2NmwtMS44MzgzNCw3Ljc4NTkxeiIgZmlsbD0iI2ZmMmQyZCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjM5LjU3Nzg0LDE4Ni40MDk5NmwxLjgzODM1LC03Ljc4NTkybDcuMDU1OTgsMS42NjZsLTEuODM4MzQsNy43ODU5MXoiIGZpbGw9IiNmZjJkMmQiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzNy4wNzc4NCwxOTYuNDA5OTZsMS44MzgzNSwtNy43ODU5Mmw3LjA1NTk4LDEuNjY2bC0xLjgzODM0LDcuNzg1OTF6IiBmaWxsPSIjZmYyZDJkIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzQuNTc3ODQsMjA2LjE1OTk2bDEuODM4MzUsLTcuNzg1OTJsNy4wNTU5OCwxLjY2NmwtMS44MzgzNCw3Ljc4NTkxeiIgZmlsbD0iI2ZmMmQyZCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjUyLjMyNzg0LDE3OC45MDk5NmwxLjgzODM1LC03Ljc4NTkybDcuMDU1OTksMS42NjZsLTEuODM4MzQsNy43ODU5MXoiIGZpbGw9IiNmZjJkMmQiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI0OS41Nzc4NCwxODguNjU5OTZsMS44MzgzNSwtNy43ODU5Mmw3LjA1NTk5LDEuNjY2bC0xLjgzODM0LDcuNzg1OTF6IiBmaWxsPSIjZmYyZDJkIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNDcuMDc3ODQsMTk4LjY1OTk2bDEuODM4MzUsLTcuNzg1OTJsNy4wNTU5OCwxLjY2NmwtMS44MzgzNCw3Ljc4NTkxeiIgZmlsbD0iI2ZmMmQyZCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPg==';

  class HolidayEvents {
    getInfo() {
      return {
        id: 'holidayevents',
        name: 'Holidays',
        color1: '#ff2d2d',
        color2: '#ad0606',
        menuIconURI: categoryIconURI,
        blocks: [
          {
            opcode: 'getCurrentDate',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current date'
          },
          {
            opcode: 'isHolidayPeriod',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is period of [HOLIDAY]?',
            arguments: {
              HOLIDAY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'holidayList',
                defaultValue: 'Christmas'
              }
            }
          },
          {
            opcode: 'getCurrentHoliday',
            blockType: Scratch.BlockType.REPORTER,
            text: 'which holiday are you in?'
          }
        ],
        menus: {
          holidayList: {
            acceptReporters: false,
            items: [
              'New Year',
              'Super Bowl',
              'NBA All-Star',
              'St. Patrick\'s Day',
              'Easter',
              '4th of July',
              'Brazilian Independence Day',
              'Halloween',
              'Thanksgiving',
              'Christmas'
            ]
          }
        }
      };
    }

    getCurrentDate() {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const year = now.getFullYear();
      return `${month}/${day}/${year}`;
    }

    _detectCurrentHoliday() {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();

      // 1. New Year: Dec 26 - Jan 2
      if ((month === 12 && day >= 26) || (month === 1 && day <= 2)) {
        return 'New Year';
      }
      // 2. Super Bowl: Jan 3 - Feb 10
      if ((month === 1 && day >= 3) || (month === 2 && day <= 10)) {
        return 'Super Bowl';
      }
      // 3. NBA All-Star: Feb 11 - Feb 20
      if (month === 2 && day >= 11 && day <= 20) {
        return 'NBA All-Star';
      }
      // 4. St. Patrick's Day: Mar 10 - Mar 18
      if (month === 3 && day >= 10 && day <= 18) {
        return 'St. Patrick\'s Day';
      }
      // 5. Easter: Mar 19 - Apr 20
      if ((month === 3 && day >= 19) || (month === 4 && day <= 20)) {
        return 'Easter';
      }
      // 6. 4th of July: Jun 25 - Jul 5
      if ((month === 6 && day >= 25) || (month === 7 && day <= 5)) {
        return '4th of July';
      }
      // 7. Brazilian Independence Day: Sep 1 - Sep 8
      if (month === 9 && day >= 1 && day <= 8) {
        return 'Brazilian Independence Day';
      }
      // 8. Halloween: Oct 1 - Nov 1
      if ((month === 10 && day >= 1) || (month === 11 && day <= 1)) {
        return 'Halloween';
      }
      // 9. Thanksgiving: Nov 10 - Nov 30
      if (month === 11 && day >= 10 && day <= 30) {
        return 'Thanksgiving';
      }
      // 10. Christmas: Dec 1 - Dec 25
      if (month === 12 && day >= 1 && day <= 25) {
        return 'Christmas';
      }

      return 'None';
    }

    isHolidayPeriod(args) {
      return this._detectCurrentHoliday() === args.HOLIDAY;
    }

    getCurrentHoliday() {
      return this._detectCurrentHoliday();
    }
  }

  Scratch.extensions.register(new HolidayEvents());
})(Scratch);