"use client";

import Table from "../components/Table";

const ModuleTable = ({ data, openModal }) => {
  const columns = [
    { key: "module_name", label: "Module Name" },
    { key: "module_code", label: "Module Code" },
    { key: "credits", label: "Credits" },
    { key: "is_core", label: "Is Core?" },
    { key: "courses", label: "Courses" },
  ];

  const formattedData = data.map((row) => ({
    ...row,
    courses: Array.isArray(row.courses)
      ? row.courses.join(", ")
      : row.courses || "—",
  }));

  const addButton = {
    label: "Add New Module",
    variant: "textOnly",
    onClick: openModal,
  };

  return (
    <Table
      data={formattedData}
      columns={columns}
      addButton={addButton}
      gridTemplateColumns="1.25fr 0.75fr 0.5fr 0.5fr 2fr"
    />
  );
};

export default ModuleTable;
