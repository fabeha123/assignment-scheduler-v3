"use client";

import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useFetchData } from "@/app/hooks/useFetchData";
import { fetchCourses } from "@/app/lib/fetchCourses";
import { fetchModulesByCourses } from "@/app/lib/fetchModulesByCourses";

const AddStudentForm = ({ onSuccess, onClose, studentData, onUpdate }) => {
  const { data: courses } = useFetchData(fetchCourses);

  const {
    formData,
    handleChange,
    successMessage,
    errorMessage,
    resetForm,
    setFormData,
  } = useFormState({
    student_id: "",
    full_name: "",
    email: "",
    courses: "",
    modules: [],
  });

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);

  useEffect(() => {
    if (!studentData) {
      resetForm();
      return;
    }

    const safeCourses = Array.isArray(studentData.courses)
      ? studentData.courses
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

    setFormData({
      student_id: studentData.student_id,
      full_name: studentData.full_name || "",
      email: studentData.email || "",
      courses: studentData.courses?.[0]?.course_code || "",
      modules: mappedModules,
    });
  }, [studentData]);

  useEffect(() => {
    const getModules = async () => {
      if (!formData.courses) {
        setModules([]);
        return;
      }

      setLoadingModules(true);
      try {
        const fetchedModules = await fetchModulesByCourses([formData.courses]);
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
      student_id: formData.student_id,
      full_name: formData.full_name,
      email: formData.email,
      courses: formData.courses,
      modules: formData.modules.map((m) => m.value),
    };

    try {
      const response = await fetch(
        studentData
          ? `/api/student/update/${studentData.student_id}`
          : "/api/student/addStudent",
        {
          method: studentData ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Request failed");
      }

      studentData ? onUpdate() : onSuccess();
    } catch (error) {
      alert(
        `Error ${studentData ? "updating" : "adding"} student: ${error.message}`
      );
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      buttonVariant="actionBlueFilled"
      submitLabel={studentData ? "Update Student" : "Add Student"}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        <Form.InputTextMain
          label="Kingston ID"
          value={formData.student_id}
          onChange={
            studentData
              ? () => {}
              : (e) => handleChange("student_id", e.target.value)
          }
          required
          placeholder="Enter student ID"
          type="text"
          readOnly={!!studentData}
        />
        <Form.InputTextMain
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
          required
        />
        <Form.InputTextMain
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        <Form.InputSelect
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

export default AddStudentForm;
