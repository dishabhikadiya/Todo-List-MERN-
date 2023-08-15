const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const user = require("./Routes/userRoute");
const todo = require("./Routes/todoRoute");
const path = require("path");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uplodes", express.static("uplodes"));
app.use("/api", user);
app.use("/api", todo);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
