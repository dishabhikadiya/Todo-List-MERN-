import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  console.log("setOTP", message);
  const handleEmailChange = (e) => {
    console.log("ee", e);
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/forgot", {
        email,
      });

      console.log("ress", response.data.data);
      if (response?.data?.data) {
        document.cookie = `otp=${response?.data?.data}`;
        setMessage("Please cheak Email !!");
        console.log("please cheak Email", response?.data?.data);
      }
    } catch (error) {
      console.error("Error:", error);
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
      {message}

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
      <Button
        variant="contained"
        sx={{ minWidth: 120, m: 1 }}
        onClick={handleResetPassword}
      >
        Sent
      </Button>
      <Link href="/" variant="body2">
        <Button variant="contained">Back to Login</Button>
      </Link>
    </Box>
  );
};

export default ForgotPassword;
