"use client";

import React, { useState } from "react";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useSubmitForm } from "@/app/hooks/useSubmitForm";
import { useFetchData } from "@/app/hooks/useFetchData";
import { fetchCourses } from "@/app/lib/fetchCourses";
import { fetchRoles } from "@/app/lib/fetchRoles";
import { fetchModulesByCourses } from "@/app/lib/fetchModulesByCourses";

const AddStaffForm = ({ onSuccess, onClose }) => {
  const { data: courses } = useFetchData(fetchCourses);
  const { data: roles } = useFetchData(fetchRoles);

  const {
    formData,
    handleChange,
    successMessage,
    errorMessage,
    resetForm,
    setFormData,
  } = useFormState({
    full_name: "",
    email: "",
    role: "",
    courses: [],
    modules: [],
  });

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);

  const { handleSubmit } = useSubmitForm("/api/staff", onSuccess, resetForm);

  // Fetch modules when courses change
  React.useEffect(() => {
    const getModules = async () => {
      if (!formData.courses || formData.courses.length === 0) {
        setModules([]);
        setFormData((prev) => ({ ...prev, modules: [] })); // Reset modules
        return;
      }

      setLoadingModules(true);
      try {
        const fetchedModules = await fetchModulesByCourses(
          formData.courses.map((c) => c.value)
        );

        const selectedModules = formData.modules
          .map(
            (module) =>
              fetchedModules.find((m) => m.value === module.value) || module
          )
          .filter(Boolean);

        setModules(fetchedModules);
        setFormData((prev) => ({ ...prev, modules: selectedModules }));
      } catch (error) {
        console.error("Failed to fetch modules");
      } finally {
        setLoadingModules(false);
      }
    };

    getModules();
  }, [formData.courses]);

  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(
          {
            ...formData,
            courses: formData.courses.map((c) =>
              typeof c === "object" && c.value ? c.value : c
            ),
            modules: formData.modules.map((m) =>
              typeof m === "object" && m.value ? m.value : m
            ),
          },
          e
        );
      }}
      buttonVariant="actionBlueFilled"
      submitLabel="Add Staff"
    >
      {/* Row 1: Full Name, Email, Role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        <Form.InputTextMain
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
          required
          placeholder="Enter full name"
          type="text"
        />
        <Form.InputTextMain
          label="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          placeholder="Enter email"
          type="email"
        />
        <Form.InputSelect
          label="Role"
          value={formData.role}
          onChange={(val) => handleChange("role", val)}
          required
          options={roles}
        />
      </div>

      {/* Row 2: Courses & Modules Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        <Form.InputMultiSelect
          label="Courses"
          value={formData.courses}
          onChange={(value) => {
            handleChange("courses", value);
          }}
          options={courses}
        />
        <Form.InputMultiSelect
          label="Modules"
          value={formData.modules}
          onChange={(value) => handleChange("modules", value)}
          options={modules}
          isDisabled={loadingModules}
          loading={loadingModules}
        />
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default AddStaffForm;
