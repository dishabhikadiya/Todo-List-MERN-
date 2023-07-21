const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./User");
const login = require("./login");
var cors = require("cors");
const jwtMiddleware = require("./jwt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Register a new user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const existingUser = await User.findOne({ email });
    console.log("existingUser", existingUser);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    console.log("new", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to register user" });
  }
});
// Login an existing user
app.post("/login", jwtMiddleware, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "EFREGDFBY65TGHJU7765GBHNMKUFDVGT5H67JNYTYN5YN65"
    );
    user.token = token;
    await login.create({ token: token, user_id: user._id });
    res.status(200).json({ token });
    console.log("token", token);
  } catch (err) {
    res.status(500).json({ message: "Failed to log in" });
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
