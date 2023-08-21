import React from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Otp = () => {
  const [otp, setOTP] = useState("");
  const [message, setMessage] = useState("");

  const handleOTPChange = (event) => {
    setOTP(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/otp", {
        otp,
      }); // Replace with your actual API endpoint

      if (response.data.success) {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
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
      Pleace Enter Your Valid Email !!
      <MuiOtpInput sx={{ m: 1 }} value={otp} onChange={handleOTPChange} />
      <Button variant="contained" onClick={handleSubmit}>
        submit
      </Button>
      {message && <p>{message}</p>}
    </Box>
  );
};

export default Otp;
