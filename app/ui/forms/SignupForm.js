"use client";

import React, { useState } from "react";
import Form from "../components/Form";

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    institute: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  //adding random functions for now
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Call the parent handler
    if (onSuccess) {
      onSuccess(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
        type="text"
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
      <Form.InputSelect
        icon="/icons/fi_2231649.svg"
        name="institute"
        value={formData.institute}
        onChange={(e) => handleChange("institute", e.target.value)}
        required
        placeholder="Institute"
        type="text"
      />
    </Form>
  );
};

export default SignupForm;
