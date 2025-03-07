"use client";

import { useState, useEffect } from "react";
import Subheader from "../../ui/components/Subheader";
import PermissionsTable from "../../ui/tables/PermissionsTable";
import Modal from "@/app/ui/components/Modal";
import AddRoleForm from "../../ui/forms/AddRoleForm";
import { useRouter } from "next/navigation";

const PermissionsScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const router = useRouter();

  const openModal = (roleData = null) => {
    setSelectedRole(roleData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const rolesRes = await fetch("/api/roles");
      const rolesData = await rolesRes.json();

      const permissionsRes = await fetch("/api/permissions");
      const permissionsData = await permissionsRes.json();

      const formattedData = rolesData.data.map((role) => {
        let rolePermissions = permissionsData.data.filter(
          (perm) => perm.role_id === role.role_id
        );

        let permissionObj = {};
        rolePermissions.forEach((perm) => {
          permissionObj[perm.tab_name] = perm.can_write
            ? "Read & Write"
            : perm.can_read
            ? "Read"
            : "No Access";
          permissionObj["all_users"] = perm.all_users;
        });

        return {
          role_name: role.role_name,
          role_id: role.role_id,
          ...permissionObj,
        };
      });

      setRoles(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (role_id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this role?"
    );
    if (!isConfirmed) return;

    setLoadingId(role_id);

    try {
      const deleteResponse = await fetch(`/api/permissions/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_id }),
      });

      const deleteData = await deleteResponse.json();

      if (deleteResponse.ok && deleteData.success) {
        alert("✅ Role and associated permissions deleted successfully!");
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.role_id !== role_id)
        );
      } else {
        throw new Error(deleteData.message || "Failed to delete role");
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Permissions"
        actionButtons={[
          {
            label: "Add New Role",
            variant: "outlined",
            onClick: () => openModal(null),
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-center mt-6">Loading roles...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <PermissionsTable
            data={roles}
            openModal={openModal}
            showActions={true}
            onDelete={handleDelete}
            loadingId={loadingId}
            setRoles={setRoles}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedRole ? "Update Role" : "Add Role"}
      >
        <AddRoleForm
          roleData={selectedRole}
          onSuccess={fetchRoles}
          onUpdate={fetchRoles}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default PermissionsScreen;
