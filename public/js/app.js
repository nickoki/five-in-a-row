var socket = io()

angular
  .module("fiveApp", [
    "ngResource" //This does AJAX for you :)
  ])
  .controller("FiveController", [
    "$scope",
    "FiveFactory",
    FiveControllerFunction
  ])
  .factory("FiveFactory",[
    "$resource",
    FiveFactoryFunction
  ])

  function FiveControllerFunction($scope, FiveFactory){
    this.rows = FiveFactory.query()
    console.log("Controler FXN");
    this.newGame = function(){
      this.newRow = new FiveFactory()
      this.newRow.cells = ["", "", "", "", ""]
      for (let i = 0; i < 5; i++) {
        // this.newRow.$save().then(row => {
        //   console.log("Done");
        // })
        socket.emit('new_game_event', this.newRow)
      }
    }
  }

  function FiveFactoryFunction($resource){
    return $resource("/api", {}, {
      newGame: {
        method: "POST"
      }
    })
  }
