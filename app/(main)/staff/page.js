"use client";

import { useState, useRef, useEffect } from "react";
import Subheader from "../../ui/components/Subheader";
import StaffTable from "../../ui/tables/StaffTable";
import Modal from "@/app/ui/components/Modal";
import AddStaffForm from "../../ui/forms/AddStaffForm";

const StaffScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch staff");
      }

      setStaff(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Staff"
        actionButtons={[
          {
            label: "Add New Staff",
            variant: "outlined",
            onClick: openModal,
          },
          {
            label: "Import",
            variant: "blue",
            onClick: () => console.log("Import"),
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        {/* Staff Table */}
        {loading ? (
          <p className="text-center mt-6">Loading staff...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <StaffTable data={staff} openModal={openModal} />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={"Add Staff"}>
        <AddStaffForm
          onSuccess={() => {
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
