"use client";

import React from "react";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useSubmitForm } from "@/app/hooks/useSubmitForm";

const AddCourseForm = ({ onSuccess, onClose }) => {
  const {
    formData,
    handleChange,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    resetForm,
  } = useFormState({
    name: "",
    course_code: "",
    start_date: "",
    end_date: "",
    duration: "",
  });

  const { handleSubmit } = useSubmitForm("/api/course", onSuccess, resetForm);

  return (
    <Form
      onSubmit={(e) => handleSubmit(formData, e)}
      buttonVariant="actionBlueFilled"
      submitLabel="Add Course"
    >
      {/* Course Name Full Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Form.InputTextMain
          label="Course Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          placeholder="Enter the course name"
          type="text"
        />
        <Form.InputTextMain
          label="Course Code"
          value={formData.course_code}
          onChange={(e) => handleChange("course_code", e.target.value)}
          required
          placeholder="Enter the course code"
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
