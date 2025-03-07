"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useFetchData } from "@/app/hooks/useFetchData";
import { fetchCourses } from "@/app/lib/fetchCourses";
import { useSubmitForm } from "@/app/hooks/useSubmitForm";

const AddModuleForm = ({ onSuccess, onClose, moduleData, onUpdate }) => {
  const { data: courses } = useFetchData(fetchCourses);
  const router = useRouter();

  const {
    formData,
    handleChange,
    setFormData,
    successMessage,
    errorMessage,
    resetForm,
  } = useFormState({
    module_name: "",
    module_code: "",
    is_core: false,
    credits: "",
    courses: [],
  });

  useEffect(() => {
    if (!moduleData) {
      resetForm();
      return;
    }

    const safeCourses = Array.isArray(moduleData.courses)
      ? moduleData.courses
      : [];

    const mappedCourses = safeCourses.map((c) => ({
      label: `${c.course_name} (${c.course_code})`,
      value: c.course_code,
    }));

    const boolIsCore =
      moduleData.is_core === "Yes" || moduleData.is_core === true;

    setFormData({
      module_name: moduleData.module_name || "",
      module_code: moduleData.module_code || "",
      is_core: boolIsCore,
      credits: moduleData.credits || "",
      courses: mappedCourses,
    });
  }, [moduleData]);

  const apiEndpoint = moduleData
    ? `/api/module/update/${moduleData.module_code}`
    : "/api/module/addModule";

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    if (onClose) onClose();
    router.push("/modules");
  };

  const { handleSubmit } = useSubmitForm(apiEndpoint, handleSuccess, resetForm);

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
      submitLabel={moduleData ? "Update Module" : "Add Module"}
    >
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
          onChange={
            moduleData
              ? () => {}
              : (e) => handleChange("module_code", e.target.value)
          }
          required
          placeholder="Enter module code"
          type="text"
          readOnly={!!moduleData}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <Form.InputSelect
          label="Is the Module Core?"
          value={formData.is_core === true ? "yes" : "no"}
          onChange={(val) => handleChange("is_core", val === "yes")}
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
