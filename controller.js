(function () {
  "use strict";
  /*global $*/

  function TicTacToeController() {
  }

  $.extend(TicTacToeController.prototype, {

    init: function() {
      this.game = new window.TicTacToeGame();
      // Add a dummy element at the start to match the game object's 1-based indexing
      this.cells = $('<td>').add('#board td');
      $(document).on('click', '#board.active td:not(.taken)', $.proxy(this, 'onClick'));

      // Let the AI start half of the time
      if (Math.random() < 0.5) {
        this.takeCell(0, this.game.generateMove(0));
      }
    },

    // Handles end-game conditions. Returns true iff the game is over.
    checkEnd: function(player) {
      var winCells = this.game.checkWin(player);
      if (winCells) {
        $('#board').removeClass("active");
        $.each(winCells, $.proxy(function(index, value) {
          this.cells.eq(value).addClass('win');
        }, this));
        var messagesByPlayer = [
          'You lost.',
          'You somehow beat the AI!'
        ];
        if (confirm(messagesByPlayer[player] + " Play again?")) {
          this.restartGame();
        }
        return true;
      }

      // Draw
      if (this.game.checkFull()) {
        if (confirm('The game is a draw. Play again?')) {
          this.restartGame();
        }
        return true;
      }

      return false;
    },

    restartGame: function() {
      // TODO - reset state without a full reload
      location.reload();
    },

    takeCell: function(player, index) {
      this.cells.eq(index).addClass('taken-' + player);
      this.game.cells[index] = player;
    },

    onClick: function(event) {
      var playerIndex = this.cells.index(event.target);
      if (this.game.cells[playerIndex] !== undefined) return;

      // Player's move
      this.takeCell(1, playerIndex);
      if (this.checkEnd(1)) return;

      // AI's move
      var opponentIndex = this.game.generateMove(0);
      this.takeCell(0, opponentIndex);
      this.checkEnd(0);
    }

  });


  $(function() {
    new TicTacToeController().init();
  });

}());
