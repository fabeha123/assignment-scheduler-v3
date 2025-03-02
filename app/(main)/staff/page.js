"use client";

import { useState, useEffect } from "react";
import Subheader from "../../ui/components/Subheader";
import StaffTable from "../../ui/tables/StaffTable";
import Modal from "@/app/ui/components/Modal";
import AddStaffForm from "../../ui/forms/AddStaffForm";
import { useRouter } from "next/navigation";

const StaffScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const router = useRouter();

  const openModal = (staffData = null) => {
    // If staffData has courses and it’s already an array, great.
    // If it’s not, we’ll default to []
    let safeCourses = Array.isArray(staffData?.courses)
      ? staffData.courses
      : [];

    setSelectedStaff({
      ...staffData,
      courses: safeCourses,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff/fetchStaff", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch staff");
      }

      console.log("✅ API Response BEFORE setting state:", data.data);
      setStaff(data.data);

      setTimeout(() => {
        console.log("✅ API Response AFTER setting state:", staff);
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (staff_id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this staff member?"
    );
    if (!isConfirmed) return;

    setLoadingId(staff_id);

    try {
      const response = await fetch(`/api/staff/delete/${staff_id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setStaff((prevStaff) =>
          prevStaff.filter((staff) => staff.staff_id !== staff_id)
        );
      } else {
        alert("Failed to delete staff. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while deleting staff.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Staff"
        actionButtons={[
          { label: "Add New Staff", variant: "outlined", onClick: openModal },
          {
            label: "Import",
            variant: "blue",
            onClick: () => router.push("/staff/import-staff"),
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-center mt-6">Loading staff...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <StaffTable
            data={staff}
            openModal={openModal}
            onDelete={handleDelete}
            loadingId={loadingId}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedStaff ? "Update Staff" : "Add Staff"}
      >
        <AddStaffForm
          staffData={selectedStaff}
          onSuccess={() => {
            fetchStaff();
            closeModal();
          }}
          onUpdate={() => {
            fetchStaff();
            closeModal();
          }}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default StaffScreen;
