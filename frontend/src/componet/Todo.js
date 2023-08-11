import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import DataTable from "./Details";
// import { useState } from "react";

const Todo = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [setSearchResults] = useState([]);
  const token = localStorage.getItem("token");
  console.log("token=======================", token);

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/api/todo", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        dueDate: new Date(formData.dueDate).getTime(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Todo added successfully:", data);
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  // const handleInputChangee = (event) => {
  //   setSearchQuery(event?.target?.value);
  //   axios
  //     .get(`http://localhost:3000/api/find?keyword=${searchQuery}`)
  //     .then((response) => {
  //       setSearchResults(response?.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error searching:", error);
  //     });
  // };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <AddIcon onClick={handleOpen} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <CssBaseline />
      <Container maxWidth="sm">
        <Stack spacing={2} direction="row">
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Container maxWidth="sm">
                <form onSubmit={handleSubmit}>
                  <Typography variant="h5" gutterBottom>
                    Create Todo
                  </Typography>
                  <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                    multiline
                    rows={4}
                  />
                  <TextField
                    label="Due Date"
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Box>
                    <FormControl sx={{ minWidth: 120, m: 1 }}>
                      <InputLabel id="demo-simple-select-label">
                        Priority
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData?.priority}
                        label="Priority"
                        name="priority"
                        onChange={handleInputChange}
                      >
                        <MenuItem value={"low"}>Low</MenuItem>
                        <MenuItem value={"medium"}>Medium</MenuItem>
                        <MenuItem value={"high"}>High</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, m: 1 }}>
                      <InputLabel id="demo-simple-select-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData?.status}
                        label="Status"
                        onChange={handleInputChange}
                      >
                        <MenuItem value={"pending"}>Pending</MenuItem>
                        <MenuItem value={"in-Progress"}>In-Progress</MenuItem>
                        <MenuItem value={"completed"}>Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </form>
              </Container>
            </Box>
          </Modal>
        </Stack>
      </Container>
      {<DataTable />}
    </Box>
  );
};

export default Todo;
