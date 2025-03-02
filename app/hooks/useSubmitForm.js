import { useState } from "react";

export const useSubmitForm = (apiEndpoint, onSuccess, resetForm) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (formData, e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const method = apiEndpoint.includes("/update/") ? "PATCH" : "POST";

      const res = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to submit form");
        return;
      }

      setSuccessMessage("Submitted successfully");
      if (onSuccess) onSuccess(formData);
      resetForm();
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return { handleSubmit, successMessage, errorMessage };
};
