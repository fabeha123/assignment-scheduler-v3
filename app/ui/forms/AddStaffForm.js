"use client";

import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useSubmitForm } from "@/app/hooks/useSubmitForm";
import { useFetchData } from "@/app/hooks/useFetchData";
import { fetchCourses } from "@/app/lib/fetchCourses";
import { fetchRoles } from "@/app/lib/fetchRoles";
import { fetchModulesByCourses } from "@/app/lib/fetchModulesByCourses";

const AddStaffForm = ({ onSuccess, onClose, staffData, onUpdate }) => {
  // 1) Fetch dropdown data
  const { data: courses } = useFetchData(fetchCourses);
  const { data: roles } = useFetchData(fetchRoles);

  // 2) Basic form state using your custom hooks
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

  // 3) `modules` = all currently available module options for selected courses
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);

  // ─────────────────────────────────────────────────────────────
  //  First Effect: Initialize form from `staffData` (Preloading)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!staffData) {
      resetForm(); // For "Add Staff" scenario
      return;
    }

    console.log("📌 Form Data - StaffData:", staffData);

    // Ensure `staffData.courses` is an array
    const safeCourses = Array.isArray(staffData.courses)
      ? staffData.courses
      : [];

    console.log("📌 Form Data - safeCourses:", safeCourses);

    // Map courses
    const mappedCourses = safeCourses.map((c) => ({
      label: `${c.course_name} (${c.course_code})`,
      value: c.course_code,
    }));

    console.log("📌 Mapped Courses:", mappedCourses);

    // Map modules
    const mappedModules = safeCourses.flatMap((c) =>
      (c.modules || []).map((m) => ({
        label: `${m.module_name} (${m.module_code}) - ${c.course_code}`,
        value: String(m.course_modules_id), // Ensuring it's a string
      }))
    );

    console.log("📌 Mapped Modules (Before Setting State):", mappedModules);

    // ✅ Set form data with delay to confirm update
    setFormData({
      full_name: staffData.full_name || "",
      email: staffData.email || "",
      role: staffData.role_name || "",
      courses: mappedCourses,
      modules: mappedModules, // These should persist
    });

    setTimeout(() => {
      console.log("📌 FormData After Setting (Delayed Check):", formData);
    }, 500); // Delay to ensure state has updated
  }, [staffData]);

  // ─────────────────────────────────────────────────────────────
  //  Second Effect: Fetch modules when courses change
  // ─────────────────────────────────────────────────────────────
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

        console.log("📌 Fetched Modules:", fetchedModules);
        console.log("📌 Preloaded Modules Before Filtering:", formData.modules);

        // If `formData.modules` is already set, don't override
        if (formData.modules.length > 0) {
          console.log("✅ Preloaded Modules Exist! Not Overwriting.");
          setModules(fetchedModules);
          return;
        }

        // Match module values correctly
        const stillValidModules = formData.modules.filter((m) =>
          fetchedModules.some((f) => String(f.value) === String(m.value))
        );

        console.log("📌 Still Valid Modules:", stillValidModules);

        setModules(fetchedModules);
        setFormData((prev) => ({ ...prev, modules: stillValidModules }));
      } catch (error) {
        console.error("❌ Failed to fetch modules", error);
      } finally {
        setLoadingModules(false);
      }
    };

    getModules();
  }, [formData.courses]);

  // 4) On form submit, send the selected `value` IDs to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      staff_id: staffData?.staff_id, // Use staff_id only when updating
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
      if (!response.ok)
        throw new Error(responseData.message || "Request failed");

      console.log(
        `✅ ${staffData ? "Updated" : "Added"} staff successfully`,
        responseData
      );

      staffData ? onUpdate() : onSuccess(); // Refresh staff list & close modal
    } catch (error) {
      console.error("❌ Error:", error);
      alert(
        `Error ${staffData ? "updating" : "adding"} staff: ${error.message}`
      );
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  Render the form
  // ─────────────────────────────────────────────────────────────
  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(
          {
            ...formData,
            courses: formData.courses.map((c) => c.value),
            modules: formData.modules.map((m) => m.value),
          },
          e
        );
      }}
      buttonVariant="actionBlueFilled"
      submitLabel={staffData ? "Update Staff" : "Add Staff"}
    >
      {/* Row 1: Full Name, Email, Role */}
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

      {/* Row 2: Courses & Modules */}
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
