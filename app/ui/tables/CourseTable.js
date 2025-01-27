"use client";

import Table from "../components/Table";

const CourseTable = ({ data, openModal }) => {
  const columns = [
    { key: "name", label: "Name" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "duration", label: "Duration" },
  ];

  const formattedData = data.map((row) => ({
    ...row,
    start_date: row.start_date ? row.start_date.split("T")[0] : "—",
    end_date: row.end_date ? row.end_date.split("T")[0] : "—",
  }));

  const addButton = {
    label: "Add New Course",
    variant: "textOnly",
    onClick: openModal,
  };

  return <Table data={formattedData} columns={columns} addButton={addButton} />;
};

export default CourseTable;
