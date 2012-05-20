(function () {
  "use strict";
  /*global $*/

  window.TicTacToeGame = function() {
    // Using 1-based indexing for cells so we can treat falsey values as
    // invalid indexes (e.g. inside generateMove). The value at index 0 isn't used.
    this.cells = new Array(10);
  };

  $.extend(window.TicTacToeGame.prototype, {

    lines: [
      // Horizontals
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      // Verticals
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      // Diagonals
      [1, 5, 9],
      [3, 5, 7]
    ],

    // Returns true iff all cells have been taken
    checkFull: function() {
      // Can't used indexOf to find undefined
      for (var i = 1; i < 10; i++) {
        if (this.cells[i] === undefined) return false;
      }
      return true;
    },

    // Returns an array of cell indexes if player has a win on the board,
    // otherwise returns false
    checkWin: function(player) {
      var len = this.lines.length;
      for (var i = 0; i < len; i++) {
        var line = this.lines[i];
        if (this.checkWinLine(player, line)) {
          return line;
        }
      }
      return false;
    },

    // Returns whether all cells in line are taken by player
    checkWinLine: function(player, line) {
      return (
        this.cells[line[0]] === player &&
        this.cells[line[1]] === player &&
        this.cells[line[2]] === player
      );
    },

    // Returns index if it is untaken and combo1 and combo2 are both taken
    // by player, otherwise returns false.
    checkCombo: function(player, index, combo1, combo2) {
      return (
        this.cells[index] === undefined &&
        this.cells[combo1] === player &&
        this.cells[combo2] === player
      ) ? index : false;
    },

    // Given three indexes in a line, returns the one that can be taken to
    // complete the line for `player`, or false if it doesn't exist.
    checkLine: function(player, line) {
      return (
        this.checkCombo(player, line[0], line[1], line[2]) ||
        this.checkCombo(player, line[1], line[0], line[2]) ||
        this.checkCombo(player, line[2], line[0], line[1])
      );
    },

    // Returns an index that can be taken to complete a line for `player`,
    // or false if none exist.
    checkLines: function(player) {
      var len = this.lines.length;
      for (var i = 0; i < len; i++) {
        var res = this.checkLine(player, this.lines[i]);
        if (res) return res;
      }
      return false;
    },

    // Returns the index of a corner that can be taken to set up a winning move
    // on the next turn, or false if none exist.
    checkCornerCombo: function(player) {
      return (
        this.checkCombo(player, 1, 2, 4) ||
        this.checkCombo(player, 3, 2, 6) ||
        this.checkCombo(player, 7, 4, 8) ||
        this.checkCombo(player, 9, 6, 8)
      );
    },

    // Returns the index of the first empty cell from indexes,
    // or false if none exist.
    checkCells: function(indexes) {
      var len = indexes.length;
      for (var i = 0; i < len; i++) {
        var index = indexes[i];
        if (this.cells[index] === undefined) return index;
      }
      return false;
    },

    // Generates a move for the specified player. If all of a player's moves
    // are made using this function, it should never result in a loss.
    generateMove: function(player) {
      var opponent = 1 - player; // player is either 0 or 1
      return (
        this.checkLines(player) || // win
        this.checkLines(opponent) || // block win
        // this won't get used when playing all moves via generateMove, due to
        // the simple defensive strategy below
        this.checkCornerCombo(player) || // set up for win
        this.checkCornerCombo(opponent) || // block set up for win
        // Play middle, then corners, then edges as a simple defensive strategy
        this.checkCells([5, 1, 3, 7, 9, 2, 4, 6, 8])
      );
    }

  });
}());
