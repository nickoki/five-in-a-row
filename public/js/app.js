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

    this.move = function(state, rowIndex, cellIndex){
      if (state == ""){
        socket.emit("move_event", "X")
      }
      console.log(state);
    }
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
