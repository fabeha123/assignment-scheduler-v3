"use client";

import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import { fetchCourses } from "@/app/lib/fetchCourses";
import { fetchRoles } from "@/app/lib/fetchRoles";
import { fetchModulesByCourses } from "@/app/lib/fetchModulesByCourses";

const AddStaffForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
    courses: [],
    modules: [],
  });

  const [courses, setCourses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        const courseList = await fetchCourses();
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setErrorMessage("Failed to fetch courses");
      }
    };

    const getRoles = async () => {
      try {
        const roleList = await fetchRoles();
        setRoles(roleList);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setErrorMessage("Failed to fetch roles");
      }
    };

    getCourses();
    getRoles();
  }, []);

  useEffect(() => {
    const getModules = async () => {
      if (!formData.courses || formData.courses.length === 0) {
        setModules([]);
        setFormData((prev) => ({ ...prev, modules: [] })); // Reset modules in formData
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
        setErrorMessage("Failed to fetch modules");
      } finally {
        setLoadingModules(false);
      }
    };

    getModules();
  }, [formData.courses]);

  const handleChange = (name, value) => {
    setFormData((prev) => {
      let updatedFormData = { ...prev, [name]: value || [] };

      if (name === "courses") {
        setModules([]);
        updatedFormData.modules = [];
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.full_name || !formData.email || !formData.role) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const dataToSend = {
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      courses: formData.courses.map((course) =>
        typeof course === "object" && course.value ? course.value : course
      ),
      modules: formData.modules.map((module) =>
        typeof module === "object" && module.value ? module.value : module
      ),
    };

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to add staff");
        return;
      }

      setSuccessMessage("Staff added successfully");
      if (onSuccess) onSuccess(dataToSend);

      setFormData({
        full_name: "",
        email: "",
        role: "",
        courses: [],
        modules: [],
      });

      if (onClose) onClose();
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      buttonVariant="actionBlueFilled"
      submitLabel="Add Staff"
    >
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

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default AddStaffForm;
