"use client";

import React, { useState, useEffect } from "react";
import Form from "../components/Form";

const SignupForm = ({ preloadedData, token }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (preloadedData) {
      setFormData((prev) => ({
        ...prev,
        fullname: preloadedData.fullname || "",
        email: preloadedData.email || "",
      }));
    }
  }, [preloadedData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: formData.password }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Failed to complete signup.");
    } else {
      alert("Signup successful! You can now log in.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} submitLabel="Start Scheduling">
      <div className="mb-5">
        <Form.InputText
          icon="/icons/fi_15678795.svg"
          name="fullname"
          value={formData.fullname}
          readOnly
        />
      </div>
      <div className="mb-5">
        <Form.InputText
          icon="/icons/fi_2099100.svg"
          name="email"
          value={formData.email}
          readOnly
        />
      </div>
      <div className="relative mb-5">
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

export default SignupForm;
