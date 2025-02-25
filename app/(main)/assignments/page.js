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
  const [loadingId, setLoadingId] = useState(null);

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

  // Handle Assignment Deletion
  const handleDelete = async (assignment_id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );
    if (!isConfirmed) return;

    setLoadingId(assignment_id);

    try {
      const response = await fetch(`/api/assignments/delete/${assignment_id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        alert("✅ Assignment deleted successfully!");
        setAssignments((prevAssignments) =>
          prevAssignments.filter(
            (assignment) => assignment.assignment_id !== assignment_id
          )
        );
      } else {
        alert(
          `❌ Failed to delete assignment: ${data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      alert("❌ An error occurred while deleting the assignment.");
      console.error("Error deleting assignment:", error);
    } finally {
      setLoadingId(null);
    }
  };

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
          <AssignmentTable
            data={assignments}
            showActions={true}
            onDelete={handleDelete}
            loadingId={loadingId}
          />
        )}
      </div>
    </div>
  );
};

export default AssignmentScreen;
