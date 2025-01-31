"use client";

import React from "react";

const Calendar = ({ assignments }) => {
  // If no assignments, display message
  if (!assignments || assignments.length === 0) {
    return (
      <div className="center">
        <p className="text-gray-500 text-center">
          Please input <span className="font-semibold">Module</span>,{" "}
          <span className="font-semibold">Start Date</span>, and{" "}
          <span className="font-semibold">End Date</span> to see other scheduled
          assignments.
        </p>
      </div>
    );
  }

  // Group assignments by month
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    const month = new Date(assignment.start_date).toLocaleString("default", {
      month: "long",
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(assignment);
    return acc;
  }, {});

  return (
    <div className="w-full h-auto">
      {Object.keys(groupedAssignments).map((month) => (
        <div key={month} className="mb-6">
          {/* Month Heading */}
          <div className="text-black text-lg font-semibold mb-4">{month}</div>
          {groupedAssignments[month].map((assignment, index) => (
            <div
              key={index}
              className={`w-full h-[70px] mb-4 rounded-[13px] flex items-center justify-between px-4 ${
                index % 2 === 0 ? "bg-[#dfffd3]" : "bg-[#ffe2fb]"
              }`}
            >
              {/* Assignment Details */}
              <div className="flex flex-col">
                <span className="text-black text-[15px] font-medium">
                  {assignment.title || "Assignment Title"}
                </span>
                <span className="text-black text-sm font-normal">
                  {new Date(assignment.start_date).toLocaleDateString("en-GB")}{" "}
                  - {new Date(assignment.end_date).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
