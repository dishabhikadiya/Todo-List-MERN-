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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { styled, alpha } from "@mui/material/styles";
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
export default function DataTable(id, { onFilter }) {
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
  // const [page, setPage] = useState(0);
  // const [pageSize, setPageSize] = useState(5);
  // const [resultCount, setResultCount] = useState();
  const [deleteid, setDeleteId] = useState("");

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
  }, [sort, searchQuery]);

  // const handleSearch = () => {
  //   fetchTodos();
  // };

  const fetchTodos = async () => {
    try {
      let addQuery = "";
      console.log("searchQuery", searchQuery);
      console.log("sort", sort);
      console.log("Date", dueDateLt);
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
        console.log("startTimestamp", startTimestamp);
        console.log("endTimestamp", endTimestamp);
        console.log("dueDateLt", dueDateLt);
        console.log("dueDateGt", dueDateGt);
        // onFilter({ start: startTimestamp, end: endTimestamp });
      }
      console.log("url", addQuery);
      const response = await fetch(
        `http://localhost:3000/api/find?page=1&resultPerPage=10${addQuery}`
      );
      if (!response.ok) {
        console.log("response", response);
        throw new Error("Failed to fetch todos");
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
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const handleDelete = () => {
    console.log("id", id);
    axios
      .delete(`http://localhost:3000/api/delete/${deleteid}`)
      .then((response) => {
        console.log("Todo deleted:", response?.data);
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
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
      .put(`http://localhost:3000/api/todoUpdate/${todoId}`, dataToUpdate)
      .then((response) => {
        console.log("Data updated:", response?.data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
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
      </Search>

      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateRangePicker"]}>
          <DateRangePicker
            localeText={{ start: "Check-in", end: "Check-out" }}
            // value={dueDateLt}
            // onClick={(e) => {
            //   console.log(e);
            //   setdueDatelt(e?.target?.value);
            // }}
          />
        </DemoContainer>
      </LocalizationProvider> */}

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
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
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
                <form
                  onClick={() => {
                    handleUpdate();
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Update Todo
                  </Typography>
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
