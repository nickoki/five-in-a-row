var mongoose = require("mongoose")
var Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/five-in-a-row")
mongoose.Promise = global.Promise

var RowSchema = new Schema({
  cells: Array,
})

var BoardSchema = new Schema({
  rows: [RowSchema]
})

var Row = mongoose.model("Row", RowSchema)
var Board = mongoose.model("Board", BoardSchema)

module.exports = mongoose
