"use client";

import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useFetchData } from "@/app/hooks/useFetchData";
import { fetchCourses } from "@/app/lib/fetchCourses";
import { fetchRoles } from "@/app/lib/fetchRoles";
import { fetchModulesByCourses } from "@/app/lib/fetchModulesByCourses";

const AddStaffForm = ({ onSuccess, onClose, staffData, onUpdate }) => {
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

  useEffect(() => {
    if (!staffData) {
      resetForm();
      return;
    }

    const safeCourses = Array.isArray(staffData.courses)
      ? staffData.courses
      : [];

    const mappedCourses = safeCourses.map((c) => ({
      label: `${c.course_name} (${c.course_code})`,
      value: c.course_code,
    }));

    const mappedModules = safeCourses.flatMap((c) =>
      (c.modules || []).map((m) => ({
        label: `${m.module_name} (${m.module_code}) - ${c.course_code}`,
        value: String(m.course_modules_id),
      }))
    );

    const roleObject = roles.find((r) => r.label === staffData.role_name);
    const roleId = roleObject ? roleObject.value : "";

    setFormData({
      full_name: staffData.full_name || "",
      email: staffData.email || "",
      role: roleId,
      courses: mappedCourses,
      modules: mappedModules,
    });
  }, [staffData, roles, resetForm, setFormData]);

  useEffect(() => {
    const getModules = async () => {
      if (!formData.courses || formData.courses.length === 0) {
        setModules([]);
        return;
      }

      setLoadingModules(true);
      try {
        const fetchedModules = await fetchModulesByCourses(
          formData.courses.map((c) => c.value)
        );

        setModules(fetchedModules);
        setFormData((prev) => ({
          ...prev,
          modules: prev.modules.filter((m) =>
            fetchedModules.some((f) => String(f.value) === String(m.value))
          ),
        }));
      } catch (error) {
        console.error("Error fetching modules", error);
      } finally {
        setLoadingModules(false);
      }
    };

    getModules();
  }, [formData.courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      staff_id: staffData?.staff_id || null,
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      courses: formData.courses.map((c) => c.value),
      modules: formData.modules.map((m) => m.value),
    };

    try {
      const response = await fetch(
        staffData ? `/api/staff/update/${staffData.staff_id}` : "/api/staff",
        {
          method: staffData ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Request failed");
      }

      staffData ? onUpdate() : onSuccess();
    } catch (error) {
      alert(
        `Error ${staffData ? "updating" : "adding"} staff: ${error.message}`
      );
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      buttonVariant="actionBlueFilled"
      submitLabel={staffData ? "Update Staff" : "Add Staff"}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        <Form.InputTextMain
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
          required
        />
        <Form.InputTextMain
          label="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        <Form.InputMultiSelect
          label="Courses"
          value={formData.courses}
          onChange={(value) => handleChange("courses", value)}
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

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default AddStaffForm;
