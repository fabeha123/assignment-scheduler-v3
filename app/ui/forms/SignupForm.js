"use client";

import React, { useState } from "react";
import Form from "../components/Form";

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // Show success/error feedback to the user
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Update field state
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Clear any previous messages on new attempt
    setSuccessMessage("");
    setErrorMessage("");

    try {
      //POST the form data to signup api
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response from server:", data);

      if (!res.ok) {
        // res.ok == false => status >= 400
        setErrorMessage(data.message || "Failed to submit form");
        return;
      }

      // If res.ok is true => status 200 => user created
      setSuccessMessage("Sign-up successful! You can now log in.");

      // 2) Trigger any parent callback if needed
      if (onSuccess) {
        onSuccess(formData);
      }

      // reset the form fields
      setFormData({
        fullname: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} submitLabel="Start Scheduling">
      <Form.InputText
        icon="/icons/fi_15678795.svg"
        name="fullname"
        value={formData.fullname}
        onChange={(e) => handleChange("fullname", e.target.value)}
        required
        placeholder="Full Name"
        type="text"
      />

      <Form.InputText
        icon="/icons/fi_2099100.svg"
        name="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
        placeholder="Email"
        type="email"
      />

      <div className="relative">
        <Form.InputText
          icon="/icons/fi_103089.svg"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
          placeholder="Password"
          type={passwordVisible ? "text" : "password"}
        />
        <div
          className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          <img
            src={
              passwordVisible
                ? "/icons/fi_11502607.svg"
                : "/icons/fi_4855030.svg"
            }
            alt="Toggle Password Visibility"
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Success and error messages */}
      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default SignupForm;
