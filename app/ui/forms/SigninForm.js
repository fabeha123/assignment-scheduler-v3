"use client";

import React, { useState } from "react";
import Form from "../components/Form";

const SigninForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  //adding random functions for now -- need to edit once database is ready
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Call a parent handler if provided
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
        icon="/icons/fi_2099100.svg"
        name="username"
        value={formData.username}
        onChange={(e) => handleChange("username", e.target.value)}
        required
        placeholder="Username"
        type="text"
      />
      <div className="relative">
        <Form.InputText
          icon="/icons/fi_103089.svg"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
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
    </Form>
  );
};

export default SigninForm;
