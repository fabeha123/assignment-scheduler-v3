"use client";

import Table from "../components/Table";

const ModuleTable = ({
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
      idKey: row.module_code,
      coursesDisplay: originalCourses
        .map((c) => `${c.course_name} (${c.course_code})`)
        .join(", "),
    };
  });

  const columns = [
    { key: "module_name", label: "Module Name" },
    { key: "module_code", label: "Module Code" },
    { key: "credits", label: "Credits" },
    { key: "is_core", label: "Is Core?" },
    { key: "coursesDisplay", label: "Courses" },
  ];

  const addButton = {
    label: "Add New Module",
    variant: "textOnly",
    onClick: () => openModal(null),
  };

  return (
    <Table
      data={formattedData}
      columns={columns}
      addButton={addButton}
      gridTemplateColumns="1.25fr 0.75fr 0.5fr 0.5fr 2fr"
      showActions={showActions}
      onDelete={onDelete}
      loadingId={loadingId}
      onEdit={openModal}
    />
  );
};

export default ModuleTable;
