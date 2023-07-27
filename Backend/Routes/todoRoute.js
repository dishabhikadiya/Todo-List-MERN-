const express = require("express");
const router = express.Router();
const {
  createTodo,
  todoFind,
  oneRecordFind,
  remove,
  update,
} = require("../Controller/todoController");

router.post("/todo", createTodo);
router.get("/find", todoFind);
router.get("/findOne/:id", oneRecordFind);
router.delete("/delete/:id", remove);
router.put("/todoUpdate/:id", update);
module.exports = router;
