"use client";

import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import { fetchCourses } from "@/app/lib/fetchCourses";

const AddModuleForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    module_name: "",
    module_code: "",
    is_core: false, // boolean
    credits: "",
    courses: [],
  });

  const [courses, setCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // fetch course from lib (utility function)
  useEffect(() => {
    const getCourses = async () => {
      const courseList = await fetchCourses();
      setCourses(courseList);
    };

    getCourses();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => {
      // Convert credits to a number
      if (name === "credits") {
        return { ...prev, credits: Number(value) };
      }

      // Convert "isCore" to a boolean (true if user chose "yes", else false)
      if (name === "is_core") {
        return { ...prev, is_core: value };
      }

      // Otherwise, just set the value
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 1) Ensure isCore is strictly boolean before sending
      const dataToSend = {
        ...formData,
        is_core:
          formData.is_core === "yes"
            ? true
            : formData.is_core === "no"
            ? false
            : !!formData.is_core,
      };

      // 2) POST the data
      const res = await fetch("/api/module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to submit form");
        return;
      }

      setSuccessMessage("Module added successfully");
      if (onSuccess) onSuccess(dataToSend);

      // Reset the form fields
      setFormData({
        module_name: "",
        module_code: "",
        is_core: false,
        credits: "",
        courses: [],
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
      submitLabel="Add Module"
    >
      {/* Row 1: Module Name + Module Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <Form.InputTextMain
          label="Module Name"
          value={formData.module_name}
          onChange={(e) => handleChange("module_name", e.target.value)}
          required
          placeholder="Enter the module name"
          type="text"
        />
        <Form.InputTextMain
          label="Module Code"
          value={formData.module_code}
          onChange={(e) => handleChange("module_code", e.target.value)}
          required
          placeholder="Enter the module code"
          type="text"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <Form.InputSelect
          label="Is the Module Core?"
          value={formData.is_core ? "yes" : "no"}
          onChange={(val) => handleChange("is_core", val)}
          required
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <Form.InputTextMain
          label="Credits"
          value={formData.credits}
          onChange={(e) => handleChange("credits", e.target.value)}
          required
          placeholder="Credits"
          type="number"
        />
      </div>

      <Form.InputMultiSelect
        label="Courses"
        value={formData.courses}
        onChange={(value) => handleChange("courses", value)}
        options={courses}
      />

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default AddModuleForm;
