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

  // Fetch courses and roles when the component mounts
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

  // Fetch modules based on selected courses in real-time
  useEffect(() => {
    const fetchModules = async () => {
      console.log("📌 formData.courses BEFORE fetch:", formData.courses);

      if (!formData.courses || formData.courses.length === 0) {
        console.warn("⚠️ No courses selected, resetting modules.");
        setModules([]);
        return;
      }

      setLoadingModules(true);
      try {
        const moduleList = await fetchModulesByCourses(formData.courses);
        console.log("✅ Modules fetched:", moduleList);
        setModules(moduleList);
      } catch (error) {
        console.error("❌ Error fetching modules:", error);
        setErrorMessage("Failed to fetch modules");
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, [formData.courses]);

  // Handle general form input changes
  const handleChange = (name, value) => {
    console.log(`📌 handleChange called - ${name}:`, value);

    setFormData((prev) => ({
      ...prev,
      [name]: value || [],
    }));

    // If courses are changed, reset modules
    if (name === "courses") {
      console.log("📌 Courses changed, resetting modules.");
      setModules([]);
      setFormData((prev) => ({ ...prev, modules: [] }));
    }
  };

  // Handle form submission
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
      courses: formData.courses.map((course) => course.value),
      modules: formData.modules.map((module) => module.value),
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

      // Reset the form fields
      setFormData({
        full_name: "",
        email: "",
        role: "",
        courses: [],
        modules: [],
      });

      if (onClose) onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
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
          onChange={(val) => handleChange("role", val.value)}
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
          isDisabled={loadingModules} // Only disable while fetching
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
