import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/reset", {
        email,
        newPassword,
      }); // Replace with your actual API endpoint

      if (response.data.success) {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 3,
  };
  return (
    <Box sx={style}>
      Please Enter Your Email And New Password !!
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Please Enter Your Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={handleEmailChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Enter Your New Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={newPassword}
        onChange={handleNewPasswordChange}
      />
      <Button
        variant="contained"
        sx={{ minWidth: 120, m: 1 }}
        onClick={handleSubmit}
      >
        submit
      </Button>
      {message && <p>{message}</p>}
    </Box>
  );
};

export default ResetPassword;
