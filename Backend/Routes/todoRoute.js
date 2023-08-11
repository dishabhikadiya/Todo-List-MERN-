const express = require("express");
const jwtMiddleware = require("../middleware/jwt");
const router = express.Router();
const {
  createTodo,
  oneRecordFind,
  remove,
  update,
  todoFind,
} = require("../Controller/todoController");

router.post("/todo", jwtMiddleware, createTodo);
router.get("/find", jwtMiddleware, todoFind);
router.get("/findOne/:id", jwtMiddleware, oneRecordFind);
router.delete("/delete/:id", jwtMiddleware, remove);
router.put("/todoUpdate/:id", jwtMiddleware, update);

module.exports = router;
