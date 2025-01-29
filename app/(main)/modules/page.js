"use client";

import { useState, useEffect } from "react";
import Subheader from "../../ui/components/Subheader";
import ModuleTable from "../../ui/tables/ModuleTable";
import ModuleModal from "../../ui/modals/ModuleModal";
import AddModuleForm from "../../ui/forms/AddModuleForm";

const ModuleScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to fetch modules from the API
  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/module", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      setModules(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Subheader */}
      <div className="border-b border-[#e8ebf0]">
        <Subheader
          title="Modules"
          actionButtons={[
            {
              label: "Add New Module",
              variant: "outlined",
              onClick: openModal,
            },
          ]}
        />
      </div>

      {/* Module Table */}
      {loading ? (
        <p className="text-center mt-6">Loading modules...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-6">{error}</p>
      ) : (
        <ModuleTable data={modules} openModal={openModal} />
      )}

      {/* Modal */}
      <ModuleModal isOpen={isModalOpen} onClose={closeModal}>
        <AddModuleForm
          onSuccess={() => {
            fetchModules();
            closeModal();
          }}
          onClose={closeModal}
        />
      </ModuleModal>
    </div>
  );
};

export default ModuleScreen;
