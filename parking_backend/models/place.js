const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  zone: { type: Number, required: true },
  price: { type: Number, required: true },
  daily: { type: Number, required: true },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  //  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
