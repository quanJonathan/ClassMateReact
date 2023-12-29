import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
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
  styled,
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
import { toast } from "react-toastify";

import MuiTableCell from "@mui/material/TableCell";
import { handleDownload } from "./DownloadExcelButton";

const TableCell = styled(MuiTableCell)`
  :last-of-type{
      width: 100,
      maxWidth: 90,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderStyle: 'border-box'
  }
`;

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

  const [currentName, setCurrentName] = useState("");

  const sampleGradingData = [
    ["studentId", "Score"],
    ["20127600", 10],
    ["20127004", 10],
    ["20127128", 10],
  ];

  const handleUploadAndUpdate = (data) => {
    const members = [];
    data.forEach((row, rowIndex) => {
      if (row != null && rowIndex > 1) {
        members.push({
          studentId: row[1],
          fullName: row[2],
          state: "pending",
        });
      }
    });
  };

  const headerOptions = [
    {
      label: "Download template",
      action: () =>
        handleDownload(sampleGradingData, `sampleGrading_${currentName}.xlsx`),
    },
    {
      label: "Upload grade",
      action: handleUploadAndUpdate,
    },
    { label: "Edit" },
    { label: "Delete" },
    { label: "Return all" },
  ];

  const openModal = () => {};

  const rowHeaderOptions = [
    {
      label: "Map account",
      action: () => openModal(),
    },
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
      <Table aria-label="scoring-table" sx={{ width: "auto" }}>
        <CustomTableHeader data={headers} options={headerOptions} />
        <CustomTableBody
          data={rows}
          options={bodyOptions}
          rowHeaderOptions={rowHeaderOptions}
        />
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
    <TableHead>
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
                wordBreak: "break-word",
                width: 120,
              }}
              align={row?.align}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="column">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxLines: 1, overflow: "hidden" }}
                  >
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
                </Stack>
                <OptionMenu
                  actionIcon={
                    <MoreVertIcon onClick={(e) => setCurrentName(row?.name)} />
                  }
                  options={options}
                />
              </Box>
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );
};

const CustomTableBody = ({ data, options, rowHeaderOptions }) => {
  console.log("data in body");
  console.log(data);
  const originalTable = [...data];
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
    //console.log(updatedData[rowIndex].homeworks[cellIndex])
    updatedData[rowIndex].homeworks[cellIndex].score = value;
    setEditedData(updatedData);
  };

  const handleIdEdit = (rowIndex, value) => {
    const updatedData = [...editedData];
    //console.log(updatedData[rowIndex].homeworks[cellIndex])
    updatedData[rowIndex].user.studentId = value;
    setEditedData(updatedData);
  };

  const handleSaving = async (rowIndex, cellIndex) => {
    //console.log(editedData)

    const newValue = editedData[rowIndex].homeworks[cellIndex].score;
    const maxScore = editedData[rowIndex].homeworks[cellIndex].maxScore;

    if (!newValue) return;

    if (isNaN(newValue)) toast.error("Must be a number");
    else if (newValue > maxScore || newValue < 0) {
      toast.error(`Must in range 0-${maxScore}`);
    } else {
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
    }
  };

  const handleKeyDown = (event, rowIndex, cellIndex) => {
    if (event.key === "Enter") {
      // console.log("Data saved:", editedData[rowIndex].data[cellIndex]);
      handleSaving(rowIndex, cellIndex);
    }
  };

  const handleIdKeyDown = (event, rowIndex) => {
    if (event.key === "Enter") {
      // console.log("Data saved:", editedData[rowIndex].data[cellIndex]);
      handleIdSaving(rowIndex, 0);
    }
  };

  const handleBlur = () => {};

  return (
    <TableBody>
      {data?.map((row, rowIndex) => (
        <TableRow key={`row-${row?._id}-${rowIndex}`}>
          <TableCell align={row?.align}>
            <Stack direction="row" justifyContent="space-between">
              {row?.user.state == 'activated' ? (
                <Avatar
                  {...stringAvatar(
                    row?.user
                      ? `${row?.user.lastName} ${row?.user.firstName}`
                      : "Default Name"
                  )}
                  size="large"
                  edge="start"
                  aria-label="account of user"
                />
              ) : (
                <Avatar
                  size="large"
                  edge="start"
                  aria-label="account of user"
                />
              )}
              {/* <Typography alignContent="center" sx={{ mt: 1, ml: 2 }}>
                {row?.user.studentId}
              </Typography> */}
              <TextField
                  id={`name-${rowIndex}`}
                  value={row?.user.studentId}
                  //inputMode="numeric"
                  variant="standard"
                  onChange={(e) =>
                    handleIdEdit(rowIndex, e.target.value)
                  }
                  maxRows={1}
                  sx={{
                    minWidth: 0,
                    maxWidth: "50%",
                    textAlign: "center",
                    mt: 1,
                    input: {
                      m: 0,
                    },
                  }}
                  placeholder="MSSV"
                  InputProps={{ disableUnderline: true, 
                    readOnly: originalTable[rowIndex]?.user.studentId                 
                  }}
                  onKeyDown={(e) => handleIdKeyDown(e, rowIndex)}
                  //onBlur={(e) => handleSaving(rowIndex, colIndex)}
                  type="text"
                  
                />
              <OptionMenu
                actionIcon={<MoreVertIcon />}
                options={rowHeaderOptions}
              />
            </Stack>
            <Typography variant="body2">
              {row?.user.firstName + " " + row?.user.lastName}
            </Typography>
          </TableCell>
          {row?.homeworks?.map((col, colIndex) => (
            <TableCell
              key={`cell-${row?._id}-${col?._id}`}
              sx={{
                border: "1px solid #ddd",
                position: "relative",
                minWidth: 0,
              }}
              onMouseEnter={() =>
                setHoveredCell({ rowIndex: rowIndex, colIndex: colIndex })
              }
              onMouseLeave={() => setHoveredCell(null)}
            >
              <Stack
                alignContent="center"
                direction="row"
                justifyContent="space-between"
                spacing={1}
              >
                <TextField
                  id={`score-${colIndex}-${rowIndex}`}
                  value={col?.score}
                  //inputMode="numeric"
                  variant="standard"
                  onChange={(e) =>
                    handleCellEdit(rowIndex, colIndex, e.target.value)
                  }
                  maxRows={1}
                  sx={{
                    minWidth: 0,
                    maxWidth: "50%",
                    textAlign: "center",
                    input: {
                      m: 0,
                      color: col?.state !== "final" ? "green" : "black",
                      fontWeight: col?.state !== "final" ? "600" : "normal",
                    },
                  }}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  //onBlur={(e) => handleSaving(rowIndex, colIndex)}
                  type="text"
                  InputProps={{
                    disableUnderline: false,
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          m: 0,
                          color:
                            col?.state !== "final" && col?.score
                              ? "green"
                              : "black",
                          fontWeight:
                            col?.state !== "final" && col?.score
                              ? "600"
                              : "normal",
                        }}
                      >
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
              {col?.state === "pending" && col?.score && (
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  Draft
                </Typography>
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};
