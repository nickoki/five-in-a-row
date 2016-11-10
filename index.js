var express = require("express")
var app = express()
var http = require('http').Server(app)
var mongoose = require("mongoose")
var io = require("socket.io")(http)
var db = require("./db/schema.js")
var Row = db.model("Row")
var bodyParser = require("body-parser")

app.use("/assets", express.static("public"))
app.use(bodyParser.json({extended: true}))

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html")
})

app.get("/api", function(req, res){
  Row.find({}).then(rows => {
    res.json(rows)
  })
})

// app.post("/api", function(req, res){
//   Row.remove({}).then( () => {
//     Row.create(req.body).then(row =>{
//       res.json(row)
//     })
//   })
// })

io.on("connection", socket => {
  socket.on("new_game_event", row => {
    io.emit("new_game_event", row)
    if (row){
      Row.create({
        cells: row
      })
      console.log("Row created.");
    }
  })
})

http.listen(4500, () => {
  console.log("HaRaMbE");
})
