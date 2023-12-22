import React, { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExcelJS from "exceljs";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { width } from "@mui/system";
import { render } from "react-dom";

const EditableDataGrid = () => {
  const [data, setData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const dataHomeWork = [
    {
      id: 1,
      header: "work something 1",
      field: "int",
    },
    {
      id: 2,
      header: "work something 2",
      field: "int",
    },
  ];

  const handleEdit = (params) => {
    console.log("Edit clicked for cell:", params);
    // Implement your edit logic here
    handleClose();
  };

  const handleDelete = (params) => {
    console.log("Delete clicked for cell:", params);
    // Implement your delete logic here
    handleClose();
  };

  const handleIconClick = (event, cell) => {
    setAnchorEl(event.currentTarget);
    setSelectedCell(cell);
  };

  const handleCellHover = (event, cell) => {
    setHoveredCell(cell);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCell(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(file);

    const sheet = workbook.worksheets[0];
    const sheetData = [];
    // Extract column names from the first row
    const columnNames = sheet.getRow(1).values;
    console.log(columnNames)

    sheet.eachRow((row, rowIndex) => {
      if (rowIndex !== 1) {
        const rowData = { id: rowIndex };
        sheet.columns.forEach((column, colIndex) => {
          rowData[columnNames[colIndex]] = row.getCell(colIndex + 1).value;
        });
        sheetData.push(rowData);
      }
    });

    console.log(sheetData);

    setData(sheetData);
  };

  const columns =
    data.length > 0
      ? Object.keys(data[0]).map((key) => (
        {
          field: key,
          headerName: key,
          width: 150,
          renderCell: (params) => (
            <EditableCell
              params={params}
              onDoubleClick={() => handleEditCell(params.row.id, key)}
              handleCellHover={handleCellHover}
            />
          ),
          sortable: false,
        }))
      : [];


  const handleEditCell = (row, col) => {
    setAnchorEl(null);
    setSelectedCell({ row, col });
  };

  const EditableCell = ({ params, onDoubleClick, handleCellHover }) => {
    const { value, api, field } = params;
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const handleBlur = () => {
      handleEdit({
        id: selectedCell.row,
        col: selectedCell.col,
        value: inputValue,
      });
      setSelectedCell(null);
    };

    const isCellHovered =
      hoveredCell && hoveredCell.row === params.id && hoveredCell.col === field;

    return (
      <div
        style={{
          position: "relative",
          cursor: "pointer",
        }}
        onMouseOver={(e) => handleCellHover(e, { row: params.id, col: field })}
        onMouseOut={() => setHoveredCell(null)}
      >
        {isCellHovered && (
          <IconButton
            style={{
              position: "absolute",
              top: "50%",
              left: "100%",
              transform: "translateY(-50%)",
            }}
            onClick={(e) => handleIconClick(e, { row: params.id, col: field })}
          >
            <MoreVertIcon />
          </IconButton>
        )}
        {selectedCell && selectedCell.row === params.id && (
          <IconButton
            style={{ position: "absolute", top: 0, right: 0 }}
            onClick={(e) =>
              handleIconClick(e, {
                row: selectedCell.row,
                col: selectedCell.col,
              })
            }
          >
            <MoreVertIcon />
          </IconButton>
        )}
        {params.isCellSelected ? (
          <input
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        ) : (
          <div onDoubleClick={onDoubleClick}>{value}</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          style: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleEdit(selectedCell)}>Edit</MenuItem>
        <MenuItem onClick={() => handleDelete(selectedCell)}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default EditableDataGrid;
