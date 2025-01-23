"use client";

import Button from "./Button";

export default function Table({ data = [], columns = [], AddButtonComponent }) {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-[95%] max-w-[1440px] bg-white border border-[#e8ebf0] rounded-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[4rem_2fr_2fr_1.5fr_3fr] bg-white border-b border-[#e8ebf0] px-4 py-2 text-sm font-light text-black">
          <div className="text-left"></div>
          {columns.map((col) => (
            <div key={col.key} className="text-left">
              {col.label}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[4rem_2fr_2fr_1.5fr_3fr] border-b border-[#e8ebf0] px-4 py-3 text-sm text-black"
          >
            {/* Checkbox placeholder - might remove this and use it active status later*/}
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border border-[#e8ebf0] rounded bg-white"></div>
            </div>
            {columns.map((col) => (
              <div key={col.key} className="flex items-center">
                <span>{row[col.key] || "—"}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Add Button */}
        <div className="p-4">
          {AddButtonComponent ? (
            <AddButtonComponent />
          ) : (
            <Button
              variant="textOnly"
              onClick={() => console.log("Button clicked!")}
            >
              Add New Student
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
