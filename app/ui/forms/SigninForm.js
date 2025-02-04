"use client";

import React, { useState } from "react";
import Form from "../components/Form";

const SigninForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSuccess) {
      onSuccess(formData);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      submitLabel="Start Scheduling"
      buttonVariant="primary"
    >
      <div className="mb-5">
        <Form.InputText
          icon="/icons/fi_2099100.svg"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          placeholder="Email"
          type="email"
        />
      </div>

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
          onClick={() => setPasswordVisible(!passwordVisible)}
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
