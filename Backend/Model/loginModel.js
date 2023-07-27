const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const token = mongoose.model("token", userSchema);

module.exports = token;
