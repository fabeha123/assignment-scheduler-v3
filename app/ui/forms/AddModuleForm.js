"use client";

import React from "react";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useSubmitForm } from "@/app/hooks/useSubmitForm";
import { useFetchData } from "@/app/hooks/useFetchData";
import { fetchCourses } from "@/app/lib/fetchCourses";

const AddModuleForm = ({ onSuccess, onClose }) => {
  const { data: courses } = useFetchData(fetchCourses); // Fetch courses using custom hook

  const { formData, handleChange, successMessage, errorMessage, resetForm } =
    useFormState({
      module_name: "",
      module_code: "",
      is_core: false, // boolean
      credits: "",
      courses: [],
    });

  const { handleSubmit } = useSubmitForm("/api/module", onSuccess, resetForm);

  return (
    <Form
      onSubmit={(e) =>
        handleSubmit(
          {
            ...formData,
            is_core:
              formData.is_core === "yes"
                ? true
                : formData.is_core === "no"
                ? false
                : !!formData.is_core,
          },
          e
        )
      }
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

      {/* Row 2: Core Module Selection & Credits */}
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
          onChange={(e) => handleChange("credits", Number(e.target.value))}
          required
          placeholder="Credits"
          type="number"
        />
      </div>

      {/* Row 3: Courses Selection */}
      <Form.InputMultiSelect
        label="Courses"
        value={formData.courses}
        onChange={(value) => handleChange("courses", value)}
        options={courses}
      />

      {/* Success and Error Messages */}
      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default AddModuleForm;
