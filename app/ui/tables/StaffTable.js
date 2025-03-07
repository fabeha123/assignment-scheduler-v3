"use client";

import Table from "../components/Table";

const StaffTable = ({
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
      idKey: row.staff_id,
      coursesDisplay: originalCourses
        .map((c) => `${c.course_name} (${c.course_code})`)
        .join(", "),
    };
  });

  const columns = [
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role_name", label: "Role" },
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
      gridTemplateColumns="1fr 1.25fr 0.75fr 0.75fr 1.75fr"
      showActions={showActions}
      onDelete={onDelete}
      loadingId={loadingId}
      onEdit={openModal}
    />
  );
};

export default StaffTable;
