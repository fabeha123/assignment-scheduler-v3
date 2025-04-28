"use client";

import Table from "../components/Table";

const StudentsTableAllColumns = ({ data, showActions = true }) => {
  const columns = [
    { key: "student_id", label: "Kingston ID" },
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "courses", label: "Courses" },
    { key: "modules", label: "Modules" },
  ];

  const formattedData = data.map((row) => ({
    ...row,
    courses: Array.isArray(row.courses)
      ? row.courses.join(", ")
      : row.courses || "—",
    modules: Array.isArray(row.modules)
      ? row.modules.join(", ")
      : row.modules || "—",
  }));

  return (
    <Table
      data={formattedData}
      columns={columns}
      gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
      showActions={showActions}
      //addButton={null}
    />
  );
};

export default StudentsTableAllColumns;
