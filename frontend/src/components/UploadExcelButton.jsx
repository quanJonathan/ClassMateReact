import React, { useState } from "react";
import { IconButton } from "@mui/material";
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

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <IconButton onClick={handleButtonClick}>
        <UploadOutlined />
      </IconButton>
    </div>
  );
};

export default ExcelUploadButton;
