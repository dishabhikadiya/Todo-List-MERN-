const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["pending", "in-Progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Number,
    },
    images: {
      type: String,
    },
  },
  { timestamps: true }
);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
