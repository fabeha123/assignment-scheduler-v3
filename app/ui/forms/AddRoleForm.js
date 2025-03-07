"use client";

import React, { useEffect } from "react";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { fetchRoles } from "@/app/lib/fetchRoles";

const AddRoleForm = ({ onSuccess, onClose, roleData, onUpdate }) => {
  const {
    formData,
    handleChange,
    successMessage,
    errorMessage,
    resetForm,
    setFormData,
  } = useFormState({
    role_name: "",
  });

  useEffect(() => {
    if (!roleData) {
      resetForm();
      return;
    }

    setFormData({
      role_name: roleData.role_name || "",
    });
  }, [roleData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      role_id: roleData?.role_id || null,
      role_name: formData.role_name,
    };

    try {
      const response = await fetch(
        roleData ? "/api/roles/update" : "/api/roles/add",
        {
          method: roleData ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Request failed");
      }

      roleData ? onUpdate() : onSuccess();

      onClose();
    } catch (error) {
      alert(`Error ${roleData ? "updating" : "adding"} role: ${error.message}`);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      buttonVariant="actionBlueFilled"
      submitLabel={roleData ? "Update Role" : "Add Role"}
    >
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6">
        <Form.InputTextMain
          label="Role Name"
          value={formData.role_name}
          onChange={(e) => handleChange("role_name", e.target.value)}
          required
        />
      </div>

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default AddRoleForm;
