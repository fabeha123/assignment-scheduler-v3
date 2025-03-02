"use client";

import Table from "../components/Table";

const StaffTable = ({
  data,
  openModal,
  onDelete,
  loadingId,
  showActions = true,
}) => {
  console.log("📌 StaffTable - Received data:", data);

  // Instead of overwriting row.courses with a string,
  // keep the array for editing, but create a 'coursesDisplay' for the table.
  const formattedData = data.map((row) => {
    const originalCourses = Array.isArray(row.courses) ? row.courses : [];
    return {
      ...row,
      idKey: row.staff_id,
      // We'll add this field ONLY for displaying in the table:
      coursesDisplay: originalCourses
        .map((c) => `${c.course_name} (${c.course_code})`)
        .join(", "),
    };
  });

  // We can now display 'coursesDisplay' if we want a Courses column
  const columns = [
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role_name", label: "Role" },
    { key: "status", label: "Status" },
    { key: "coursesDisplay", label: "Courses" }, // show the comma‐separated string
  ];

  const addButton = {
    label: "Add New User",
    variant: "textOnly",
    onClick: openModal,
  };

  return (
    <Table
      data={formattedData}
      columns={columns}
      addButton={addButton}
      // Adjust gridTemplateColumns to fit your new column
      gridTemplateColumns="1fr 1fr 1fr 1fr 1.5fr"
      showActions={showActions}
      onDelete={onDelete}
      loadingId={loadingId}
      onEdit={openModal}
    />
  );
};

export default StaffTable;
