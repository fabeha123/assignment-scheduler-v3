"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Subheader from "../../ui/components/Subheader";
import AssignmentTable from "../../ui/tables/AssignmentTable";

const AssignmentScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch assignments from API
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/assignments", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch assignments");
      }

      setAssignments(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Assignments"
        actionButtons={[
          {
            label: "Add New Assignment",
            variant: "blue",
            onClick: () => router.push("/assignments/add-assignment"),
          },
        ]}
      />
      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-center mt-6">Loading assignments...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <AssignmentTable data={assignments} />
        )}
      </div>
    </div>
  );
};

export default AssignmentScreen;
