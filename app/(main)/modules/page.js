"use client";

import { useState, useEffect } from "react";
import Subheader from "../../ui/components/Subheader";
import ModuleTable from "../../ui/tables/ModuleTable";
import Modal from "@/app/ui/components/Modal";
import AddModuleForm from "../../ui/forms/AddModuleForm";
import { useRouter } from "next/navigation";

const ModuleScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to fetch modules from the API
  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/module", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch modules");
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
      <Subheader
        title="Modules"
        actionButtons={[
          {
            label: "Add New Course",
            variant: "outlined",
            onClick: openModal,
          },
          {
            label: "Import",
            variant: "blue",
            onClick: () => router.push("/modules/import-modules"),
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-center mt-6">Loading modules...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <ModuleTable
            data={modules}
            openModal={openModal}
            showActions={true}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={"Add Module"}>
        <AddModuleForm
          onSuccess={() => {
            fetchModules();
            closeModal();
          }}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ModuleScreen;
