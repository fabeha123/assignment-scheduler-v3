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
  const [loadingId, setLoadingId] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const router = useRouter();

  const openModal = (moduleData = null) => {
    setSelectedModule(moduleData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
  };
  // Function to fetch modules from the API
  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/module/fetchModules", { method: "GET" });
      const data = await res.json();

      console.log("Fetched Modules from API:", JSON.stringify(data, null, 2)); // Debugging log

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

  // Fetch modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);

  // Handle Module Deletion
  const handleDelete = async (module_code) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this module?"
    );
    if (!isConfirmed) return;

    setLoadingId(module_code);
    console.log("Module Code is....", module_code); // Debugging log

    try {
      const response = await fetch(`/api/module/delete/${module_code}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        alert("✅ Module deleted successfully!");
        setModules((prevModules) =>
          prevModules.filter((module) => module.module_code !== module_code)
        );
      } else {
        alert(`❌ Failed to delete module: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("❌ An error occurred while deleting the module.");
      console.error("Error deleting module:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Modules"
        actionButtons={[
          {
            label: "Add New Course",
            variant: "outlined",
            onClick: () => openModal(null),
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
            onDelete={handleDelete}
            loadingId={loadingId}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedModule ? "Update Module" : "Add Module"}
      >
        <AddModuleForm
          moduleData={selectedModule}
          onSuccess={() => {
            fetchModules();
            closeModal();
          }}
          onUpdate={() => {
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
