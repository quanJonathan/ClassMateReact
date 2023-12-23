import React, { useState } from "react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const ClassGrade = (props) => {
  const tableData = [
    { title: "name", data: ["quan", "1", "2"] },
    { title: "dob", data: ["bao", "2", "3"] },
    // Add more data as needed
  ];

  return (
    <div>
      <ExcelLikeTable tableData={tableData} />
    </div>
  );
};

const ExcelLikeTable = ({ tableData }) => {
  const [editedData, setEditedData] = useState(tableData);
  const [hoveredCell, setHoveredCell] = useState(null);

  const handleCellEdit = (rowIndex, cellIndex, value) => {
    const updatedData = [...editedData];
    updatedData[rowIndex].data[cellIndex] = value;
    setEditedData(updatedData);
  };

  const handleKeyDown = (event, rowIndex, cellIndex) => {
    if (event.key === 'Enter') {
      // Save the data or perform any other action here
      console.log('Data saved:', editedData[rowIndex].data[cellIndex]);
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ border: '1px solid #ddd' }}></TableCell>
          {editedData.map((row, rowIndex) => (
            <TableCell key={`header-${rowIndex}`} sx={{ border: '1px solid #ddd' }}>
              <Box sx={{display: 'flex', flexWrap: true}}>
                {row.title}
                <IconButton>
                  <MoreVertIcon/>
                </IconButton>
              </Box>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {editedData.map((row, rowIndex) => (
          <TableRow key={`row-${rowIndex}`}>
            {row.data.map((col, colIndex) => (
              <TableCell
                key={`cell-${rowIndex}-${colIndex}`}
                sx={{ border: '1px solid #ddd', position: 'relative' }}
                onMouseEnter={() => setHoveredCell({rowIndex: rowIndex, colIndex: colIndex})}
                onMouseLeave={() => setHoveredCell(null)}
              >
                <TextField 
                  value={col}
                  inputMode="decimal"
                  variant="filled"
                  onChange={(e) => handleCellEdit(rowIndex, colIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                />
                {hoveredCell &&
                  hoveredCell.rowIndex === rowIndex &&
                  hoveredCell.cellIndex === colIndex && (
                    <IconButton
                      onClick={() => console.log('clicked')}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
