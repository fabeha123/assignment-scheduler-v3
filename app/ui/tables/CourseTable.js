"use client";

import Table from "../components/Table";

const CourseTable = ({
  data,
  openModal,
  onDelete,
  loadingId,
  showActions = true,
}) => {
  const columns = [
    { key: "name", label: "Name" },
    { key: "course_code", label: "Course Code" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "duration", label: "Duration" },
  ];

  const formattedData = data.map((row) => ({
    ...row,
    idKey: row.course_code,
    start_date: row.start_date ? row.start_date.split("T")[0] : "—",
    end_date: row.end_date ? row.end_date.split("T")[0] : "—",
  }));

  const addButton = {
    label: "Add New Course",
    variant: "textOnly",
    onClick: () => openModal(null),
  };

  return (
    <Table
      data={formattedData}
      columns={columns}
      addButton={addButton}
      gridTemplateColumns="1.5fr 1fr 1fr 1fr 1fr"
      showActions={showActions}
      onDelete={onDelete}
      loadingId={loadingId}
      onEdit={openModal}
    />
  );
};

export default CourseTable;
