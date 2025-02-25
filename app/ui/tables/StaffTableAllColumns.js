"use client";

import Table from "../components/Table";

const StaffTableAllColumns = ({ data, showActions = true }) => {
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
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
    />
  );
};

export default StaffTableAllColumns;
