"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useSubmitForm } from "@/app/hooks/useSubmitForm";

const AddCourseForm = ({ onSuccess, onClose, courseData }) => {
  const router = useRouter();

  const {
    formData,
    handleChange,
    successMessage,
    errorMessage,
    resetForm,
    setFormData,
  } = useFormState({
    name: "",
    course_code: "",
    start_date: "",
    end_date: "",
    duration: "",
  });

  useEffect(() => {
    if (!courseData) {
      resetForm();
      return;
    }

    setFormData({
      name: courseData.name || "",
      course_code: courseData.course_code || "",
      start_date: courseData.start_date || "",
      end_date: courseData.end_date || "",
      duration: courseData.duration || "",
    });
  }, [courseData, setFormData, resetForm]);

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (!isNaN(startDate) && !isNaN(endDate) && endDate > startDate) {
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const diffYears = Math.floor(diffDays / 365);

        setFormData((prev) => ({
          ...prev,
          duration: diffYears > 0 ? `${diffYears} years` : `${diffDays} days`,
        }));
      } else {
        setFormData((prev) => ({ ...prev, duration: "" }));
      }
    }
  }, [formData.start_date, formData.end_date]);

  const apiEndpoint = courseData
    ? `/api/course/update/${courseData.course_code}`
    : "/api/course";

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    if (onClose) onClose();
    router.push("/courses");
  };

  const { handleSubmit } = useSubmitForm(apiEndpoint, handleSuccess, resetForm);

  return (
    <Form
      onSubmit={(e) => handleSubmit(formData, e)}
      buttonVariant="actionBlueFilled"
      submitLabel={courseData ? "Update Course" : "Add Course"}
    >
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
          onChange={
            courseData
              ? () => {}
              : (e) => handleChange("course_code", e.target.value)
          }
          required
          placeholder="Enter course code"
          type="text"
          readOnly={!!courseData}
        />
      </div>

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
          onChange={() => {}}
          required
          placeholder="Duration (auto-calculated)"
          type="text"
          readOnly
        />
      </div>

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default AddCourseForm;
