"use client";

import React, { useState } from "react";
import Form from "../ui/components/Form";

const SigninScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Update formData when fields change
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-[440px] h-[401px] relative">
      {/* Title Section */}
      <div className="w-[242px] h-[107px] absolute top-0">
        <div className="text-black text-5xl font-semibold font-['Inter']">Sign in</div>
        <div className="absolute top-[88px]">
          <span className="text-black text-base font-medium font-['Inter']">
            Sign in with your{" "}
          </span>
          <span className="text-black text-base font-bold font-['Inter']">Zippy</span>
          <span className="text-black text-base font-medium font-['Inter']">
            {" "}
            account
          </span>
        </div>
      </div>

      {/* Form Section */}
      <div className="absolute top-[137px]">
        <Form onSubmit={handleSubmit} submitLabel="Start Scheduling">
          <Form.InputText
            icon={<span>👤</span>}
            name="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            required
            placeholder="Username"
          />
          <Form.InputText
            icon={<span>📧</span>}
            name="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            placeholder="Password"
          />
        </Form>
      </div>
            <div className="w-[440px] h-[99px] absolute top-[250px]">
        <div className="absolute left-[101px] top-[80px]">
          <span className="text-[#48515c] text-base font-light font-['Inter']">
            Don’t have an account?
          </span>
          <span className="text-black text-base font-bold font-['Inter']"> Sign up</span>
        </div>
      </div>
    </div>

  );
};

export default SigninScreen;
