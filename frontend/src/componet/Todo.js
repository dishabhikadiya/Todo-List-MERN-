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
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

const Todo = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openn, setOpenn] = useState(false);
  const handleOpenn = () => setOpenn(true);
  const handleClosee = () => setOpenn(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useState();
  const token = localStorage.getItem("token");
  console.log("token=======================", token);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const opennn = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseee = () => {
    setAnchorEl(null);
  };

  const [formData, setFormData] = useState({
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
  useEffect(() => {
    userdata();
  }, []);

  const userdata = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      console.log("data=====", data?.data);
      setUser(data?.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    console.log("token=====", token);
  };

  const LogoutButton = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/logout");
      if (response.status === 200) {
        navigate("/");
        console.log(response);
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };
  const stylee = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "1px solid",
    boxShadow: 24,
    p: 1,
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <AccountCircleIcon onClick={handleOpenn} sx={{ mr: 3 }} /> */}
          <Modal
            open={openn}
            onClose={handleClosee}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={stylee}>
              <h6>{user?._id}</h6>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                name: {user?.name}
              </Typography>
              <p>Email: {user?.email}</p>
            </Box>
          </Modal>

          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ m: 2 }}
                aria-controls={opennn ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={opennn ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}></Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={opennn}
            onClose={handleCloseee}
            onClick={handleCloseee}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleOpenn}>
              <Avatar /> My account
            </MenuItem>
            {/* <MenuItem onClick={handleCloseee}>
              <Avatar /> My account
            </MenuItem> */}
            <Divider />
            {/* <MenuItem onClick={handleCloseee}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem> */}
            <MenuItem onClick={handleCloseee}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={LogoutButton}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
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
                {imageUrl && (
                  <Stack direction="row" spacing={4}>
                    <Avatar alt="Cindy Baker" src={imageUrl} />
                  </Stack>
                )}
                <form onSubmit={handleSubmit}>
                  <Typography variant="h5" gutterBottom>
                    Create Todo
                  </Typography>
                  <label htmlFor="upload-image">
                    <Button variant="contained" component="span">
                      Upload
                    </Button>
                    <input
                      id="upload-image"
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileUpload}
                    />
                  </label>
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
