"use client";

import { useState } from "react";
import * as ExcelJS from "exceljs";

export default function UploadBox({ onDataParsed, fields }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      parseExcel(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      parseExcel(file);
    }
  };

  const parseExcel = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async (e) => {
      const buffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const sheet = workbook.worksheets[0];
      const jsonData = [];

      sheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return;

        const rowData = {};

        for (const [key, columnIndex] of Object.entries(fields)) {
          rowData[key] = row.getCell(columnIndex).value;
        }

        jsonData.push(rowData);
      });

      if (onDataParsed) {
        onDataParsed(jsonData);
      }
    };
  };

  return (
    <div
      className="w-full max-w-none p-6 border-2 border-[#770065] border-dashed rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="fileUpload"
        onChange={handleFileChange}
      />
      <label htmlFor="fileUpload" className="flex flex-col items-center">
        <span className="text-[#770065] font-semibold">
          {selectedFile ? selectedFile.name : "Upload a file..."}
        </span>
      </label>
    </div>
  );
}
