import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Popover,
  Typography,
  TextField,
  Box,
  InputAdornment,
  TableSortLabel,
  Divider,
  Avatar,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useHomeworks } from "../hook/useHomeworks";
import Spinner from "./spinner";
import OptionMenu from "./OptionMenu";
import { Link, useParams } from "react-router-dom";
import { stringAvatar } from "../helpers/stringAvator";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "../hook/useAuth";

export const ClassGrade = ({ members, homeworks }) => {
  const { headers, rows } = useHomeworks(members, homeworks);

  // console.log("rows")
  // console.log(rows)

  // console.log("headers")
  // console.log(headers)

  if (headers == null) return <Typography>No homeworks</Typography>;
  return <ExcelLikeTable headers={headers} rows={rows} />;
};

const ExcelLikeTable = ({ headers, rows }) => {
  //   console.log("rows")
  //   console.log(rows)

  //   console.log("headers")
  //   console.log(headers)

  const headerOptions = [
    { label: "Edit" },
    { label: "Delete" },
    { label: "Return all" },
  ];

  const handleClose = () => {
    console.log("Closing");
  };

  const bodyOptions = [
    { label: "View submit homework", action: () => handleClose() },
    { label: "Return homework", action: () => handleClose() },
    { label: "Accept feedback", action: () => handleClose() },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="scoring-table">
        <CustomTableHeader data={headers} options={headerOptions} />
        <CustomTableBody data={rows} options={bodyOptions} />
      </Table>
    </TableContainer>
  );
};

const CustomTableHeader = ({ data, options }) => {
  // console.log("data in header");
  // console.log(data);

  const [selectedValue, setSelectedValue] = useState("first"); // Set the initial value

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <TableHead sx={{ minWidth: 650 }}>
      <TableRow>
        {data?.map((row, rowIndex) =>
          row?.sortingField ? (
            <TableCell
              align={row?.align}
              key={`header-${rowIndex}`}
              sx={{
                border: "1px solid #ddd",
                width: 40,
                minWidth: 0,
              }}
            >
              <Select
                label="Sort"
                value={selectedValue}
                onChange={handleChange}
                autoWidth
                sx={{
                  minWidth: "unset",
                }}
              >
                <MenuItem value="first">Group by First Name</MenuItem>
                <MenuItem value="last">Group by Last Name</MenuItem>
              </Select>
            </TableCell>
          ) : (
            <TableCell
              key={`header-${row?.id}`}
              sx={{
                border: "1px solid #ddd",
                width: "150px",
                minWidth: "150px",
                display: "flex",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{maxLines: 1, overflow: "hidden"}}>
                  {format(row?.deadline, "yyyy-MM-dd HH:mm")}
                </Typography>
                <Link>{row?.label}</Link>
                <Divider />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  in total of {row?.totalScore}
                </Typography>
              </Box>
              <OptionMenu actionIcon={<MoreVertIcon />} options={options} />
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );
};

const CustomTableBody = ({ data, options }) => {
  console.log("data in body");
  console.log(data);
  if (data == null) return <div>No data</div>;
  const [editedData, setEditedData] = useState(data);
  const [hoveredCell, setHoveredCell] = useState({
    rowIndex: -1,
    colIndex: -1,
  });
  //console.log(editedData)

  const { token } = useAuth();
  const { id } = useParams();

  const handleCellEdit = (rowIndex, cellIndex, value) => {
    const updatedData = [...editedData];
    updatedData[rowIndex].homeworks[cellIndex].score = value;
    setEditedData(updatedData);
  };

  const handleSaving = async (rowIndex, cellIndex) => {
    //console.log(editedData)
    const updateData = {
      _id: editedData[rowIndex].homeworks[cellIndex]._id,
      memberId: editedData[rowIndex].user._id,
      score: editedData[rowIndex].homeworks[cellIndex].score,
      state: "pending",
    };

    try {
      const response = await axios.post(
        `http://localhost:3001/class/updateHomework/${id}`,
        updateData,
        {
          headers: {
            Authorization: "Bearer " + token?.refreshToken,
          },
        }
      );
      if (response) {
        console.log(response);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleKeyDown = (event, rowIndex, cellIndex) => {
    if (event.key === "Enter") {
      // console.log("Data saved:", editedData[rowIndex].data[cellIndex]);
      handleSaving(rowIndex, cellIndex);
    }
  };

  return (
    <TableBody>
      {data?.map((row, rowIndex) => (
        <TableRow key={`row-${row?._id}`} sx={{ minWidth: 0 }}>
          <TableCell
            align={row?.align}
            sx={{
              minWidth: 0,
              display: "inline-flex",
            }}
          >
            <Avatar
              {...stringAvatar(
                row?.user
                  ? `${row?.user.lastName} ${row?.user.firstName}`
                  : "Default Name"
              )}
              size="large"
              edge="start"
              aria-label="account of user"
              color="inherit"
              sx={{ mr: 2 }}
            />
            <Typography alignContent="center" sx={{ mt: 1 }}>
              {row?.user.firstName + " " + row?.user.lastName}
            </Typography>
          </TableCell>
          {row?.homeworks?.map((col, colIndex) => (
            <TableCell
              key={`cell-${row?._id}-${col?._id}`}
              sx={{
                border: "1px solid #ddd",
                position: "relative",
                width: "100px",
                minWidth: "100px",
              }}
              onMouseEnter={() =>
                setHoveredCell({ rowIndex: rowIndex, colIndex: colIndex })
              }
              onMouseLeave={() => setHoveredCell(null)}
            >
              <Stack
                alignContent="center"
                direction="row"
                justifyContent="start"
                spacing={2}
                sx={{ minWidth: 0 }}
              >
                <TextField
                  value={col?.score}
                  inputMode="decimal"
                  variant="standard"
                  onChange={(e) =>
                    handleCellEdit(rowIndex, colIndex, e.target.value)
                  }
                  maxRows={1}
                  sx={{ minWidth: 52, width: 52 }}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  onBlur={(e) => handleSaving(rowIndex, colIndex)}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        /{col?.maxScore}
                      </InputAdornment>
                    ),
                  }}
                />
                {hoveredCell?.rowIndex === rowIndex &&
                  hoveredCell?.colIndex === colIndex && (
                    <OptionMenu
                      actionIcon={<MoreVertIcon />}
                      options={options}
                    />
                  )}
              </Stack>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};
