"use client";

import Button from "./Button";

export default function Table({ data = [], columns = [], addButton = {} }) {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-[95%] max-w-[1440px] bg-white border border-[#e8ebf0] rounded-md overflow-hidden">
        {/* Table Header */}
        <div
          className={`grid grid-cols-[2fr_1fr_1fr_3fr] bg-white border-b border-[#e8ebf0] px-4 py-2 text-sm font-light text-black`}
        >
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
            className="grid grid-cols-[2fr_1fr_1fr_3fr] border-b border-[#e8ebf0] px-4 py-3 text-sm text-black relative"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center">
                <span>{row[col.key] || "—"}</span>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="actionOutlined"
                onClick={() => console.log(`Edit row ${rowIndex}`)}
              >
                Edit
              </Button>
              <Button
                variant="actionBlueFilled"
                onClick={() => console.log(`Delete row ${rowIndex}`)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <div className="p-4">
          <Button
            variant={addButton.variant || "textOnly"}
            onClick={
              addButton.onClick || (() => console.log("Button clicked!"))
            }
          >
            {addButton.label || "Add New Item"}
          </Button>
        </div>
      </div>
    </div>
  );
}
