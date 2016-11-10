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


io.on("connection", socket => {

  socket.on("new_board_event", board => {
    io.emit("new_board_event", board)
    Board.remove({}).then( () => {
      if (board) {
        let emptyRow = new Row({
          cells: ['', '', '', '', '']
        })
        Board.create({
          rows: [emptyRow, emptyRow, emptyRow, emptyRow, emptyRow]
        })
      }
    })
  })

  socket.on("move_event", move => {
    io.emit("move_event", move)
    Board.find({}).then(board => {
      console.log("before" + board[0].rows[1].cells[4]);
      board[0].rows[1].cells[4].update("X").then(() => {

        console.log("after" + board[0].rows[1].cells[4]);
      })
    })
  })
})

http.listen(4500, () => {
  console.log("HaRaMbE");
})
