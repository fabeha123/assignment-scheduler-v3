"use client";

import Table from "../components/Table";

const StudentsTable = ({
  data,
  openModal,
  onDelete,
  loadingId,
  showActions = true,
}) => {
  const formattedData = data.map((row) => {
    const originalCourses = Array.isArray(row.courses) ? row.courses : [];
    return {
      ...row,
      idKey: row.student_id,
      coursesDisplay: originalCourses
        .map((c) => `${c.course_name} (${c.course_code})`)
        .join(", "),
    };
  });

  const columns = [
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "student_id", label: "Kingston Id" },
    { key: "status", label: "Status" },
    { key: "coursesDisplay", label: "Courses" },
  ];

  const addButton = {
    label: "Add New User",
    variant: "textOnly",
    onClick: () => openModal(null),
  };

  return (
    <Table
      data={formattedData}
      columns={columns}
      addButton={addButton}
      gridTemplateColumns="1fr 1fr 1fr 1fr 1.5fr"
      showActions={showActions}
      onDelete={onDelete}
      loadingId={loadingId}
      onEdit={openModal}
    />
  );
};

export default StudentsTable;
