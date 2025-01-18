"use client";

import { useState } from "react";

export default function TableWithAddRow({ initialData = [], columns = [] }) {
  const [rows, setRows] = useState(initialData);

  const handleAddStudent = () => {
    const newStudent = {
      name: "New Student",
      course: "New Course",
      year: "N/A",
      modules: "N/A",
    };
    setRows((prev) => [...prev, newStudent]);
  };

  return (
    <div className="w-full bg-white border border-[#e8ebf0] rounded-md overflow-hidden">
      {/* Table Header */}
      <div className="flex w-full bg-white border-b border-[#e8ebf0] px-4 py-2 text-sm font-light text-black">
        {columns.map((col) => (
          <div key={col.key} className="flex-1">
            {col.label}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      {rows.map((row, idx) => (
        <div
          key={idx}
          className="flex w-full border-b border-[#e8ebf0] px-4 py-3 text-sm text-black"
        >
          {/* Checkbox placeholder */}
          <div className="w-4 h-4 border border-[#e8ebf0] mr-2 bg-white rounded" />
          {columns.map((col) => (
            <div key={col.key} className="flex-1">
              {row[col.key] ?? ""}
            </div>
          ))}
        </div>
      ))}

      {/* Add button */}
      <div className="p-4">
        <button
          onClick={handleAddStudent}
          className="border border-[#e8ebf0] bg-white rounded-[7px] px-4 py-2 text-[#48515c] text-sm"
        >
          Add New Student
        </button>
      </div>
    </div>
  );
}
