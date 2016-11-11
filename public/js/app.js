var socket = io()

angular
  .module("fiveApp", [
    "ngResource" //This does AJAX for you :)
  ])
  .controller("FiveController", [
    "$scope",
    "RowFactory",
    "BoardFactory",
    FiveControllerFunction
  ])
  .factory("RowFactory", [
    "$resource",
    RowFactoryFunction
  ])
  .factory("BoardFactory", [
    "$resource",
    BoardFactoryFunction
  ])



  function FiveControllerFunction($scope, RowFactory, BoardFactory) {
    BoardFactory.query().$promise.then( board => {
      this.board = board
    })

    this.newGame = function() {
      this.newBoard = new BoardFactory()
      socket.emit('new_board_event', this.newBoard)
    }

    socket.on('new_board_event', board => {
      if (board) {
        $scope.$apply(() => {
          this.board.push({body: board})
        })
      }
    })

    this.move = function(state, rowIndex, cellIndex) {
      let newState = ""
      if (state == "") { newState = "X" }
      else if (state == "X") { newState = "O" }
      else if (state == "O") { newState = "" }

      socket.emit("move_event", {
        newState: newState,
        rowIndex: rowIndex,
        cellIndex: cellIndex
      })
    }

    socket.on('move_event', board => {
      console.log(board);
      if (board) {
        $scope.$apply(() => {
          this.board.push({body: board})
        })
      }
    })
  }



  function RowFactoryFunction($resource) {
    return $resource("/api", {}, {
      newGame: {
        method: "POST"
      }
    })
  }



  function BoardFactoryFunction($resource) {
    return $resource("/api", {}, {
      newGame: {
        method: "POST"
      }
    })
  }
