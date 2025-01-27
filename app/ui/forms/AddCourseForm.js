"use client";

import React, { useState } from "react";
import Form from "../components/Form";

const AddCourseForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    duration: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to submit form");
        return;
      }

      setSuccessMessage("Course added successfully");

      if (onSuccess) onSuccess(formData);

      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        duration: "",
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
      submitLabel="Add Course"
    >
      {/* Course Name Full Row */}
      <div className="mb-6">
        <Form.InputTextMain
          label="Course Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          placeholder="Enter the course name"
          type="text"
        />
      </div>

      {/* Dates and Duration in One Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Form.InputTextMain
          label="Start Date"
          value={formData.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          required
          placeholder="Start Date"
          type="date"
        />
        <Form.InputTextMain
          label="End Date"
          value={formData.end_date}
          onChange={(e) => handleChange("end_date", e.target.value)}
          required
          placeholder="End Date"
          type="date"
        />
        <Form.InputTextMain
          label="Duration"
          value={formData.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          required
          placeholder="Duration (e.g., 3 years)"
          type="text"
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

export default AddCourseForm;
