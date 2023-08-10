const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  zone: { type: Number, required: true },
  plate: { type: String, required: true },
  price: { type: Number, required: true },
  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
