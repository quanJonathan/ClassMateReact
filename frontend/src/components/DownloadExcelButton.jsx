import React from "react";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import ExcelJS from "exceljs";
import { DownloadOutlined } from "@mui/icons-material";

const sampleDataForClass = [
  ["StudentId", "FullName"],
  ["20127004", "Minh Bảo Huỳnh"],
  ["20127600", "Tuấn Quân Lưu"],
  ["20127128", "Bảo Châu Đặng"],
];

export async function handleDownload(defaultData, fileName) {
  // Sample data for the Excel file
  const data = [...defaultData];

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Add data to the worksheet
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Generate a blob from the workbook
  const blob = await workbook.xlsx.writeBuffer();

  // Create a download link and trigger the download
  const url = URL.createObjectURL(new Blob([blob]));
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const DownloadExcelButton = ({ defaultData, name, toolTipName }) => {
  return (
    <Tooltip
      title={<h3>{toolTipName}</h3>}
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
      <IconButton onClick={() => handleDownload(defaultData, name)}>
        <DownloadOutlined />
      </IconButton>
    </Tooltip>
  );
};

DownloadExcelButton.defaultProps = {
  defaultData: sampleDataForClass,
  name: "example.xlsx",
};

export default DownloadExcelButton;
