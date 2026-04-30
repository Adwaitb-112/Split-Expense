const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, default: 0 }
}); 

module.exports = mongoose.model("Balance", balanceSchema);
