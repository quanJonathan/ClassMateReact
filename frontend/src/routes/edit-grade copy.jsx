import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from '@mui/system';

// Sample data
const rows = [
  { id: 1, hw1: 90, hw2: 85 },
  { id: 2, hw1: 75, hw2: 95 },
];

// Columns
const columns = [
  { field: 'id', headerName: 'ID', width: 70, editable: false },
  { field: 'hw1', headerName: 'HW1', width: 90 },
  { field: 'hw2', headerName: 'HW2', width: 90 },
];

// React component
const ExcelLikeTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [editCellId, setEditCellId] = useState(null);

  const handleMenuOpen = (event, id) => {
    // console.log(id)
    setAnchorEl(event.currentTarget);
    setHoveredCell(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setHoveredCell(null);
  };

  const handleButtonClick = (event, id) => {
    handleMenuOpen(event, id);
  };

  const handleCellDoubleClick = (params) => {
    setEditCellId(params.id);
  };

  const handleCellEditCommit = ({ id, field, value }) => {
    // Handle cell value change (e.g., update data in state or make an API call)
    // console.log(`Cell edited: ${id}, ${field}, ${value}`);
    setEditCellId(null);
  };

  const renderCell = (params) => (
    <Box
      onMouseOver={(e) => handleMenuOpen(e, params.id)}
      onMouseOut={handleMenuClose}
      onDoubleClick={() => handleCellDoubleClick(params)}
      style={{ position: 'relative',
       borderBottom: editCellId === params.id ? '1px solid red' : 'none', // Optional: Highlight the editing cell 
      }}
    >
      {params.value}
      {hoveredCell === params.id && (
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={(e) => handleButtonClick(e, params.id)}
          style={{ position: 'absolute', top: '50%', left: '100%', transform: 'translateY(-50%)' }}
        >
          <MoreVertIcon />
        </IconButton>
      )}

       {editCellId === params.id && (
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', top: '50%', left: '100%', transform: 'translateY(-50%)' }}
        >
          <MoreVertIcon />
        </IconButton>
      )}
    </Box>
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={[
          ...columns.map((col) => ({
            ...col,
            renderCell,
          })),
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableRowSelectionOnClick
        onEditCellChangeCommitted={handleCellEditCommit}
        editRowsModel={editCellId ? [{ id: editCellId }] : []}
        components={{
          Toolbar: GridToolbar,
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
        <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
        <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
      </Menu>
    </div>
  );
};

export default ExcelLikeTable;
