import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });
  const validationSchema = yup.object({
    name: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (value) => {
      const apiUrl = "http://localhost:3000/api/register";

      axios
        .post(apiUrl, value)
        .then((response) => {
          navigate("/todo");
          console.log("Registration successful!", response.data);
        })
        .catch((error) => {
          console.error("Registration failed!", error);
        });
    },
  });

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  // console.log("=====", formData);
  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const apiUrl = "http://localhost:3000/api/register";

  //   axios
  //     .post(apiUrl, formData)
  //     .then((response) => {
  //       // validator.isEmail("foo@bar.com");
  //       navigate("/dashboard");
  //       console.log("Registration successful!", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Registration failed!", error);
  //     });
  // };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={formik?.values?.name}
                  onChange={formik.handleChange}
                  error={formik?.touched.name && Boolean(formik?.errors?.name)}
                  helperText={formik?.touched.name && formik?.errors?.name}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="name"
                  name="name"
                  autoComplete="name"
                  // value={formData.name}
                  // onChange={handleChange}
                  value={formik?.formData?.name}
                  onChange={handleChange}
                  error={formik?.touched?.name && Boolean(formik?.errors?.name)}
                  helperText={formik?.touched?.name && formik?.errors?.name}
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik?.values?.email}
                  onChange={formik.handleChange}
                  error={
                    formik?.touched.email && Boolean(formik?.errors?.email)
                  }
                  helperText={formik?.touched.email && formik?.errors?.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik?.values?.password}
                  onChange={formik?.handleChange}
                  error={
                    formik?.touched.password &&
                    Boolean(formik?.errors?.password)
                  }
                  helperText={
                    formik?.touched.password && formik?.errors?.password
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
