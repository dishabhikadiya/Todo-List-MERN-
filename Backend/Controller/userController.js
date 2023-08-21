const jwtMiddleware = require("../middleware/jwt");
const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const imagespath = path.join("uplodes");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// USER REGISTER API
exports.register = catchAsyncErrors(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(409).json({ message: "pleace enter value" });
    }
    const existingUser = await User.findOne({ email: email });
    console.log("existinguser", existingUser);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log("new", newUser);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to register user", err });
  }
});

// LOGIN API
exports.login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(409)
      .json({ message: "Pleace Enter valid Email and Password" });
  }
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
    User.token = token;
    console.log("Token", token);
    await User.updateOne(
      { email: email },
      {
        token: token,
      }
    );
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Failed to log in" });
  }
});

// LOGOUT

exports.logout = catchAsyncErrors(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// GET USER DETAILS

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  // const user = await User.findById(req?.user?.userId);
  console.log("rrrrrrrrr", req?.user?.userId);
  const uEmail = req?.user?.email;
  console.log(uEmail);

  const data = await User.findOne({ email: uEmail });
  console.log("==========", data);

  console.log("uyjsafdth");
  res.status(200).json({
    success: true,
    data,
  });
});

// FORGOTPASSWORD
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    let email = req.body.email;
    console.log("sent this mail :", email);
    let otp = Math.floor(Math.random() * 9000);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "rashmitabhikadiya777@gmail.com",
        pass: "bjncwexgdbignjvz",
      },
    });

    const mailOptions = {
      from: "rashmitabhikadiya777@gmail.com",
      to: email, // Hardcoded recipient email for testing
      subject: "Forgot",
      html: `<p>OTP :-${otp}</p>`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("OTP is not vaild :", error);
      } else {
        res.cookie("obj", otp);
        console.log("Email sent successfully");
        return res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Email sent Failed" });
  }
});

// OPT verify
exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      body: { otp },
    } = req;
    console.log(req.body);
    console.log(req.cookies.obj);
    if (otp == req.cookies.obj) {
      return res
        .status(200)
        .json({ success: true, message: "pleace change your password !!" });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.log("error", error);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// RESETPASSWORD

exports.resetPassword = catchAsyncErrors(async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 8);

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
