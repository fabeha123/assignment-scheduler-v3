"use client";

import Button from "./Button";
import React from "react";

export default function Table({
  data = [],
  columns = [],
  addButton = null,
  gridTemplateColumns = "2fr 1fr 1fr 3fr",
  showActions = true,
}) {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-[95%] max-w-[1440px] bg-white border border-[#e8ebf0] rounded-md overflow-hidden">
        {/* Table Header */}
        <div
          className="grid bg-white border-b border-[#e8ebf0] px-4 py-2 text-sm font-light text-black"
          style={{ gridTemplateColumns }}
        >
          {columns.map((col) => (
            <div key={col.key} className="text-left">
              {col.label}
            </div>
          ))}
          {showActions}
        </div>

        {/* Table Rows */}
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid border-b border-[#e8ebf0] px-4 py-3 text-sm text-black"
            style={{
              gridTemplateColumns: showActions
                ? `${gridTemplateColumns} auto`
                : gridTemplateColumns,
            }}
          >
            {columns.map((col, colIndex) => {
              if (colIndex === columns.length - 1) {
                return (
                  <div
                    key={col.key}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="pr-2">{row[col.key] ?? "—"}</span>

                    {showActions && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="iconOnlyFilled"
                          onClick={() => console.log(`Edit row ${rowIndex}`)}
                        >
                          <img
                            src="/icons/fi_2985043.svg"
                            className="w-4 h-4"
                            alt="Edit"
                          />
                        </Button>
                        <Button
                          variant="iconOnlyOutlined"
                          onClick={() => console.log(`Delete row ${rowIndex}`)}
                        >
                          <img
                            src="/icons/fi_2976286.svg"
                            className="w-3 h-3"
                            alt="Delete"
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={col.key} className="flex items-center">
                    <span>{row[col.key] ?? "—"}</span>
                  </div>
                );
              }
            })}
          </div>
        ))}

        {addButton && (
          <div className="p-4">
            <Button
              variant={addButton.variant || "textOnly"}
              onClick={addButton.onClick || (() => console.log("Add clicked!"))}
            >
              {addButton.label || "Add New Item"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
