import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { styled, alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
export default function DataTable(id) {
  const token = localStorage.getItem("token");
  const [dataToUpdate, setDataToUpdate] = useState({
    title: "",
    description: "",
    duedate: "",
    priority: "",
    status: "",
  });
  const [searchQuery, setSearchQuery] = useState();
  const [todoId, setTodoId] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [sort, setSort] = useState(1);
  const [dueDateLt, setdueDatelt] = useState();
  const [dueDateGt, setdueDateGt] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [resultCount, setResultCount] = useState(0);
  const [deleteid, setDeleteId] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

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
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 70,
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      width: 130,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      width: 130,
      flex: 1,
    },
    {
      field: "priority",
      headerName: "priority",
      width: 80,
    },
    {
      field: "status",
      flex: 1,
      headerName: "status",
      width: 90,
    },
    { field: "dueDate", flex: 1, headerName: "Date", width: 90 },
    {
      field: "image",
      flex: 1,
      headerName: "image",
      width: 50,
      renderCell: (row) => {
        return <Avatar src={imageUrl?.images} />;
      },
    },
    {
      field: "delete",
      flex: 1,
      headerName: "Delete",
      width: 80,
      type: "number",
      sortable: false,
      renderCell: (row) => {
        return (
          <DeleteIcon
            variant="outlined"
            onClick={() => {
              setDeleteId(row?.row?.id);
              handleClickOpenn();
            }}
          />
        );
      },
    },
    {
      field: "edit",
      flex: 1,
      headerName: "Edit",
      width: 80,
      sortable: false,
      renderCell: (row) => {
        return (
          <EditCalendarIcon
            onClick={() => {
              setTodoId(row?.row?.id);
              console.log("rows", row?.row?.id);
              handleOpen();
            }}
          />
        );
      },
    },
  ];

  const [openn, setOpenn] = React.useState(false);

  const handleClickOpenn = () => {
    setOpenn(true);
  };

  const handleClosee = () => {
    setOpenn(false);
  };
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, [sort, searchQuery, page, pageSize, priority, status]);

  // const handleSearch = () => {
  //   fetchTodos();
  // };

  const fetchTodos = async () => {
    try {
      let addQuery = "";
      console.log("searchQuery", searchQuery);
      console.log("sort", sort);
      console.log("Date", dueDateLt);
      if (status) {
        addQuery = addQuery + `&status=${status}`;
      }
      if (sort) {
        addQuery = addQuery + `&sortkey=title&sortorder=${sort}`;
      }
      if (searchQuery) {
        addQuery = addQuery + `&keyword=${searchQuery}`;
      }
      if (dueDateGt && dueDateLt) {
        const startTimestamp = dueDateGt.getTime();
        const endTimestamp = dueDateLt.getTime();
        addQuery =
          addQuery +
          `&dueDate[gt]=${startTimestamp}&dueDate[lt]=${endTimestamp}`;
      }
      console.log("url", addQuery);

      const response = await fetch(
        `http://localhost:3000/api/find?page=${page}&resultPerPage=${pageSize}${addQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("response", response);
        throw new Error("Failed to fetch todos");
      }
      if (priority) {
        addQuery = addQuery + `&sortkey=priority&sortorder=${priority}`;
      }

      const data = await response.json();
      console.log("data?", data);
      setTodos(
        data?.task?.map((item) => ({
          ...item,
          id: item?._id,
          dueDate: new Date(item?.dueDate).toLocaleDateString(),
        }))
      );
      setPageSize(data?.resultPerPage);
      setResultCount(data?.taskCount);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const handleDelete = () => {
    console.log("id", id);
    fetch(`http://localhost:3000/api/delete/${deleteid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        fetchTodos();
      })
      .catch((error) => {
        if (error.message === "Unauthorized") {
          console.log(error);
        } else {
          alert(`${error}`);
        }
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    setDataToUpdate({
      ...dataToUpdate,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    axios
      .put(
        `http://localhost:3000/api/todoUpdate/${todoId}`,

        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Data updated:", response?.data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };
  return (
    <div
      style={{
        height: 400,
        width: "100%",
        margin: "10px",
      }}
    >
      <Search>
        <SearchIconWrapper>{/* <SearchIcon /> */}</SearchIconWrapper>
        <TextField
          key="search"
          id="search"
          size="small"
          name="search"
          label="search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl sx={{ minWidth: 100, m: 1 }}>
          <InputLabel id="demo-simple-select-label">Sort</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Sort"
            name="sort"
            value={sort}
            onChange={(e) => {
              setSort(e?.target?.value);
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="1">Ascending</MenuItem>
            <MenuItem value="-1">Descending </MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, m: 1 }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status"
            name="status"
            value={status}
            onChange={(e) => {
              setStatus(e?.target?.value);
            }}
          >
            <MenuItem value={"pending"}>Pending</MenuItem>
            <MenuItem value={"in-progress"}>In-Progress</MenuItem>
            <MenuItem value={"completed"}>Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, m: 1 }}>
          <InputLabel id="demo-simple-select-label">Priority</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Priority"
            name="priority"
            value={priority}
            onChange={(e) => {
              setPriority(e?.target?.value);
            }}
          >
            <MenuItem value={"low"}>Low</MenuItem>
            <MenuItem value={"medium"}>Medium</MenuItem>
            <MenuItem value={"high"}>High</MenuItem>
          </Select>
        </FormControl>
      </Search>
      <DatePicker
        selected={dueDateGt}
        onChange={(date) => setdueDateGt(date)}
        selectsStart
        startDate={dueDateGt}
        endDate={dueDateLt}
        placeholderText="Start Date"
      />
      <DatePicker
        selected={dueDateLt}
        onChange={(date) => setdueDatelt(date)}
        selectsEnd
        startDate={dueDateGt}
        endDate={dueDateLt}
        minDate={dueDateGt}
        placeholderText="End Date"
      />
      <button onClick={fetchTodos}>Apply Filter</button>
      <Dialog
        open={openn}
        onClose={handleClosee}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This Reacord is Delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosee}>Cancel</Button>
          <Button
            onClick={() => {
              handleDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <DataGrid
        rows={todos}
        columns={columns}
        checkboxSelection
        pagination
        rowsPerPageOptions={[5]}
        page={page === 0 ? 0 : page - 1}
        paginationMode="server"
        pageSize={pageSize}
        onPageChange={(newPage) => {
          setPage(newPage + 1);
        }}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        disableColumnMenu={true}
        hideFooterSelectedRowCount={true}
        rowCount={resultCount ?? 0}
      />

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
                <form
                  onClick={() => {
                    handleUpdate();
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Update Todo
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
                    value={dataToUpdate?.title}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={dataToUpdate?.description}
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
                    value={dataToUpdate?.dueDate}
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
                        label="Priority"
                        name="priority"
                        value={dataToUpdate?.priority}
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
                        label="Status"
                        name="status"
                        value={dataToUpdate?.status}
                        onChange={handleInputChange}
                      >
                        <MenuItem value={"pending"}>Pending</MenuItem>
                        <MenuItem value={"in-progress"}>In-Progress</MenuItem>
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
    </div>
  );
}
