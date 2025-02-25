"use client";

import Table from "../components/Table";

const StaffTable = ({
  data,
  openModal,
  onDelete,
  loadingId,
  showActions = true,
}) => {
  const columns = [
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role_name", label: "Role" },
    { key: "status", label: "Status" },
  ];

  const formattedData = data.map((row) => ({
    ...row,
    idKey: row.staff_id,
    courses: Array.isArray(row.courses)
      ? row.courses.join(", ")
      : row.courses || "—",
  }));

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
      gridTemplateColumns="1.0fr 1.0fr 1.0fr 1.0fr"
      showActions={showActions}
      onDelete={onDelete}
      loadingId={loadingId}
    />
  );
};

export default StaffTable;
