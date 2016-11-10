var mongoose = require("mongoose")
var Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/five-in-a-row")
mongoose.Promise = global.Promise

var RowSchema = new Schema({
  cells: Array,
})

var Row = mongoose.model("Row", RowSchema)

// var row1 = new Row({
//   cells: ["", "", "X", "", ""]
// })

// row1.save((err, row) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(row);
//   }
// })

module.exports = mongoose
