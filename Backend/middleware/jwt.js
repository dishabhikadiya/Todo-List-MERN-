// app.js
const jwt = require("jsonwebtoken");
const jwtMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("tok", token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "EFREGDFBY65TGHJU7765GBHNMKUFDVGT5H67JNYTYN5YN65"
    );
    console.log("dec", decoded);
    req.user = decoded;
    console.log("req", req.user);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
module.exports = jwtMiddleware;
