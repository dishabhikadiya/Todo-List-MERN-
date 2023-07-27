const jwt = require("jsonwebtoken");
const todoModel = require("../Model/todoModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcrypt");
const Api = require("../Untils/api");
// CREATE TODO
exports.createTodo = catchAsyncErrors(async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const newTodo = new todoModel({
      title,
      description,
      dueDate,
      status,
    });
    console.log(newTodo);
    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// FIND TODOS
exports.todoFind = catchAsyncErrors(async (req, res) => {
  try {
    console.log("ress", req.query);
    let api = new Api(todoModel.find(), req.query).search();
    console.log("api", api);
    const todoModels = await api.query;
    // const todos = await todoModel.find();
    res.status(200).json(todoModels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// FIND ONE TODO
exports.oneRecordFind = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const todo = await todoModel.findById(id);
    console.log("todo", todo);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE TODO

exports.remove = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await todoModel.findByIdAndRemove(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE TODO
exports.update = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;
    const updateTodos = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        dueDate,
        status,
      },
      { new: true }
    );
    res.status(200).json(updateTodos);
    if (!updateTodos) {
      return res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
