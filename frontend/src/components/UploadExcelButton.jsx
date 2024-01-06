import React, { useState } from "react";
import { IconButton, Tooltip, Zoom, useTheme } from "@mui/material";
import ExcelJS from "exceljs";
import { UploadOutlined } from "@mui/icons-material";

const ExcelUploadButton = ({ onUpload }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    const worksheet = workbook.worksheets[0];
    const data = worksheet.getSheetValues();

    onUpload(data);
  };

  const handleButtonClick = () => {
    // Programmatically trigger the file input click
    document.getElementById("fileInput").click();
  };

  const theme = useTheme();

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Tooltip
        title={<h3>Upload class members</h3>}
        TransitionComponent={Zoom}
        sx={{ fontSize: "20px" }}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -14],
                },
              },
            ],
          },
        }}
      >
        <IconButton onClick={handleButtonClick}>
          <UploadOutlined sx={{ color: theme.palette.common.main }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ExcelUploadButton;
