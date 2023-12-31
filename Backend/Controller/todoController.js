const jwt = require("jsonwebtoken");
const todoModel = require("../Model/todoModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcrypt");
const Api = require("../Untils/api");
const Todo = require("../Model/todoModel");
const path = require("path");
const imagepath = path.join("uplodes");
const fs = require("fs");
// CREATE TODO
exports.createTodo = catchAsyncErrors(async (req, res) => {
  try {
    console.log("req.body", req.body);
    console.log("file", req.file.filename);
    const { title, description, dueDate, status } = req.body;

    let imagePath = `${imagepath}/${req.file.filename}`;
    const newTodo = new todoModel({
      title,
      description,
      dueDate,
      status,
      images: imagePath,
      user: req.user.id,
    });
    console.log(newTodo);

    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// FIND TODOS
exports.todoFind = catchAsyncErrors(async (req, res) => {
  try {
    const taskCount = await Todo.find({ user: req.user.id }).countDocuments();
    console.log("check?", req.query);
    console.log("==========", req.user.email);
    const apiFeature = new Api(Todo.find({ user: req.user.id }), req.query)
      .search()
      .filter()
      .sort();

    let task = await apiFeature.query;

    let filterTaskCount = task.length;

    apiFeature.pagination();

    task = await apiFeature.query.clone();

    return res.json({
      success: true,
      task: task,
      taskCount,
      resultPerPage: Number(req.query.resultPerPage),
      filterTaskCount,
    });
  } catch (error) {
    console.error("Error getTask Location:", error);
    return res.status(500).json(responses.SERVER_ERROR());
  }
  // try {
  //   console.log("ress------------", req.query);
  //   const resultperpage = req.query.resultPerPage;
  //   const taskcount = await todoModel.find({}).countDocuments();
  //   let api = new Api(todoModel.find({}), req.query).search().filter().sort();
  //   console.log("API", Api);
  //   let todoModels = await api.query;

  //   let filteredCount = todoModels.length;

  //   api.pagination(10);

  //   todoModels = await api.query.clone();

  //   res.status(200).json(todoModels, resultperpage, taskcount, filteredCount);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ error: "Internal server error" });
  // }
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
  console.log("req.body", req.body);
  console.log(
    "file 123-----------------------------------------------------------------------------",
    req.file.filename
  );
  // return;
  try {
    const { id } = req.params;
    const { title, description, dueDate, status, priority } = req.body;
    console.log("status", status);
    console.log("priority", priority);
    if (req.file) {
      let images = `${imagepath}/${req.file.filename}`;
      const updateTodos = await todoModel.findByIdAndUpdate(
        id,
        Object.assign({ images }, req.body)
      );
      fs.unlinkSync(updateTodos.images);
      // res.status(200).json(updateTodos);
    }
    const updateTodos = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        // dueDate,
        status,
        priority,
      },
      { new: true }
    );
    res.status(200).json(updateTodos);
    if (!updateTodos) {
      console.log("errrror", error);
      return res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.log("errrror", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
