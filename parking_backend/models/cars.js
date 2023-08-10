const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const carsSchema = new Schema({
  name: { type: String, required: true },
  plate: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Cars", carsSchema);
