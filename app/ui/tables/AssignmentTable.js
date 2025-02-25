"use client";

import Table from "../components/Table";
import { useRouter } from "next/navigation";

const AssignmentTable = ({ data, onDelete, loadingId, showActions = true }) => {
  const router = useRouter();

  const columns = [
    { key: "name", label: "Assignment Name" },
    { key: "weightage", label: "Weightage (%)" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "status", label: "Status" },
  ];

  const formattedData = data.map((row) => ({
    ...row,
    name: row.assignment_name,
    idKey: row.assignment_id,
    start_date: new Date(row.start_date).toLocaleDateString("en-GB"),
    end_date: new Date(row.end_date).toLocaleDateString("en-GB"),
    status: renderStatusTags(row.status),
  }));

  const addButton = {
    label: "Add New Assignment",
    variant: "textOnly",
    onClick: () => router.push("/assignments/add-assignment"),
  };

  return (
    <Table
      data={formattedData}
      columns={columns}
      addButton={addButton}
      gridTemplateColumns="1.5fr 1fr 1fr 1fr 2fr"
      showActions={showActions}
      onDelete={onDelete}
      loadingId={loadingId}
    />
  );
};

const renderStatusTags = (status) => {
  const statusStyles = {
    "pending approval":
      "bg-orange-100 text-orange-500 border border-orange-500",
    approved: "bg-green-100 text-green-500 border border-green-500",
    "date clash": "bg-red-100 text-red-500 border border-red-500",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-light ${
        statusStyles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
};

export default AssignmentTable;
