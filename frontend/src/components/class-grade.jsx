import { useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Box,
  InputAdornment,
  Divider,
  Avatar,
  Select,
  MenuItem,
  Stack,
  styled,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useHomeworks } from "../hook/useHomeworks";
import OptionMenu from "./OptionMenu";
import { Link, useParams } from "react-router-dom";
import { stringAvatar } from "../helpers/stringAvator";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "../hook/useAuth";
import { toast } from "react-toastify";
import _ from "lodash";
import ExcelJS from "exceljs";

import MuiTableCell from "@mui/material/TableCell";
import { handleDownload } from "./DownloadExcelButton";

const TableCell = styled(MuiTableCell)`
  :last-of-type{
      width: 100,
      maxWidth: 90,
      height: 50,
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
  const { id } = useParams();

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
    {
      label: "View submit homework",
      action: () => {
        handleClose();
      },
    },
    {
      label: "Return homework",
      action: () => {
        handleClose();
      },
    },
    {
      label: "Accept feedback",
      action: () => {
        handleClose();
      },
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="scoring-table" sx={{ width: "auto" }}>
        <CustomTableHeader data={headers} />
        <CustomTableBody
          data={rows}
          options={bodyOptions}
          rowHeaderOptions={rowHeaderOptions}
        />
      </Table>
    </TableContainer>
  );
};

const CustomTableHeader = ({ data }) => {
  // console.log("data in header");
  // console.log(data);

  const [selectedValue, setSelectedValue] = useState("first"); // Set the initial value
  const { token } = useAuth();
  const { id } = useParams();

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const setData = (index) => {
    // console.log(data[index])
    setCurrentHomework(data[index]);
  };

  const [currentHomework, setCurrentHomework] = useState(null);

  const sampleGradingData = [
    ["studentId", "Score"],
    ["20127600", 10],
    ["20127004", 10],
    ["20127128", 10],
  ];

  const headerOptions = [
    {
      label: "Download template",
      action: () =>
        handleDownload(
          sampleGradingData,
          `sampleGrading_${currentHomework?.label}.xlsx`
        ),
    },
    {
      label: "Upload grade",
      action: () => handleUpload(),
    },
    { label: "Edit" },
    { label: "Delete" },
    { label: "Return all" },
  ];

  const handleUpload = () => {
    // Programmatically trigger the file input click
    // console.log(currentHomework);
    document.getElementById(`fileInput-${currentHomework?.id}`).click();
  };

  const handleUploadAndUpdate = async (data, homework) => {
    const scoringDetail = [];

    console.log(data)
    let isDataValid = true;
    data[1]?.forEach((col, colIndex) => {
      if (col != sampleGradingData[colIndex]) {
        isDataValid = false;
      }
    });

    if (isDataValid) {
      data?.map((row, rowIndex) => {
        if (row && rowIndex > 1) {
          const studentId = row[0];
          const score = row[1];

          if (studentId) {
            scoringDetail.push({
              studentId: studentId,
              score: score == "" ? 0 : score,
            });
          }
        }
      });

      // console.log(data)

      try {
        const response = await axios.post(
          `http://localhost:3001/class/updateAssignmentScore/${id}/a/${homework._id}`,
          scoringDetail,
          {
            headers: {
              Authorization: "Bearer: " + token?.refreshToken,
            },
          }
        );

        if (response.status == 202) {
          toast.success(response.statusText);
        } else {
          toast.error(response.statusText);
        }
      } catch (e) {
        toast.error(e.toString());
      }
    }else{
      toast.error("Wrong format!!!, please follow sample file.")
    }
  };

  async function handleFileChange(e, rowIndex) {
    const file = e.target.files[0];

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    const worksheet = workbook.worksheets[0];
    const excelData = worksheet.getSheetValues();
    // console.log(excelData)

    handleUploadAndUpdate(excelData, data[rowIndex]);
  }

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
              onMouseEnter={() => setData(rowIndex)}
              align={row?.align}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <input
                  type="file"
                  id={`fileInput-${row?.id}`}
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, rowIndex)}
                />
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
                  actionIcon={<MoreVertIcon />}
                  options={headerOptions}
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
  // console.log("data in body");
  // console.log(data);
  const initialEditableStates = data?.map((d) => d.user.studentId == "");
  const [editableStates, setEditableStates] = useState(initialEditableStates);

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
    console.log("editting id");
    const updatedData = [...editedData];
    // console.log(updatedData[rowIndex].user.studentId)
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

      const newEditableStates = [...editableStates];
      newEditableStates[rowIndex] = false;
      handleIdSaving(rowIndex);
    }
  };

  const handleIdSaving = async (rowIndex) => {
    const newValue = editedData[rowIndex].user.studentId;
    if (!newValue) return;

    if (isNaN(newValue)) toast.error("Must be a number");

    const updateData = {
      _id: editedData[rowIndex].user._id,
      studentId: editedData[rowIndex].user.studentId,
    };

    try {
      const response = await axios.post(
        `http://localhost:3001/auth/setUserStudentId`,
        updateData,
        {
          headers: {
            Authorization: "Bearer " + token?.refreshToken,
          },
        }
      );
      if (response.status == 202) {
        toast.success("Changed successful");
        const updateEdit = [...editableStates];
        updateEdit[rowIndex] = true;
        setEditableStates(updateEdit);
      } else {
        toast.error(response.statusText);
        editedData[rowIndex].user.studentId = "";
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleBlur = () => {};

  return (
    <TableBody>
      {data?.map((row, rowIndex) => (
        <TableRow key={`row-${row?._id}-${rowIndex}`}>
          <TableCell align={row?.align}>
            <Stack direction="row" justifyContent="space-between">
              {row?.user.state == "activated" ? (
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
                autoComplete="off"
                onChange={(e) => handleIdEdit(rowIndex, e.target.value)}
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
                inputProps={{
                  autoComplete: "off",
                }}
                InputProps={{
                  disableUnderline: true,
                  readOnly: !editableStates[rowIndex],
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
                          p: 0,
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
