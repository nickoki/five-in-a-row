var express = require("express")
var app = express()
var http = require('http').Server(app)
var bodyParser = require("body-parser")
var io = require("socket.io")(http)

var mongoose = require("mongoose")
var db = require("./db/schema.js")
var Row = db.model("Row")
var Board = db.model("Board")

app.use("/assets", express.static("public"))
app.use(bodyParser.json({extended: true}))

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html")
})

app.get("/api", function(req, res) {
  Board.find({}).then(board => {
    res.json(board)
  })
})


// Establish socket connection
io.on("connection", socket => {

  // On new board event, remove old board and replace with an empty one
  socket.on("new_board_event", board => {
    console.log(board);
    io.emit("new_board_event", board)

    // Delete old board
    Board.remove({}).then( () => {
      if (board) {

        // Create new board with 16 rows of 16 empty cells
        let r = new Row({ cells: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] })
        Board.create({
          rows: [r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r]
        }, err => {
          if (err) { console.log(err) }
        })
      }
    })
  })

  // On move event (cell click), switch state of cell
  socket.on("move_event", move => {
    console.log(move);
    io.emit("move_event", move)

    // Get board
    Board.find({}).then(board => {

      // Edit board
      var newRows = board[0].rows
      newRows[move.rowIndex].cells[move.cellIndex] = move.newState

      // Update board with changes
      Board.findOneAndUpdate({}, { rows: newRows }, { new: true }, err => {
        if (err) { console.log(err) }
      })
    })
  })
})

http.listen(4500, () => {
  console.log("HaRaMbE");
})
