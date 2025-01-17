"use client";
import Link from "next/link";
import React, { useState } from "react";
import Form from "../ui/components/Form";

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility

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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="w-full min-h-screen p-5 bg-white rounded-[50px] flex overflow-hidden">
      {/* Left Section (50% width) */}
      <div className="relative w-1/2 flex items-center justify-center">
        {/* White background panel */}
        <div className="absolute inset-0 bg-white rounded-[30px]" />

        {/* Blue panel covering 80% of the left side */}
        <div className="absolute inset-0 w-[80%] bg-[#bbe4ff] rounded-[30px]" />

        {/* Logo in the top-left corner */}
        <div className="absolute left-[30px] top-[30px] flex items-center gap-2">
          <img src="/assets/logo.png" alt="Zippy Logo" className="w-6 h-6" />
          <div className="text-white text-2xl font-normal font-['Gochi_Hand']">
            Zippy
          </div>
        </div>

        {/* Banner image centered */}
        <div className="relative z-10 flex justify-center">
          <img
            src="/assets/banner-image.png"
            alt="Banner"
            className="max-w-[100%] h-auto"
          />
        </div>
      </div>

      {/* Right Section (50% width) */}
      <div className="relative w-1/2 flex items-center justify-center">
        {/* White background panel */}
        <div className="absolute inset-0 bg-white rounded-[30px]" />
        <div className="relative w-[440px] flex flex-col items-start">
          {/* Heading */}
          <div className="mb-10">
            <div className="text-black text-5xl font-semibold font-['Inter']">
              Sign up
            </div>
            <div className="mt-5">
              <span className="text-black text-base font-medium font-['Inter']">
                Create a new account and start scheduling
              </span>
            </div>
          </div>

          {/* Form */}
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
            <Form.InputText
              icon="/icons/fi_2231649.svg"
              name="institute"
              value={formData.institute}
              onChange={(e) => handleChange("institute", e.target.value)}
              required
              placeholder="Institute"
              type="text"
            />
          </Form>

          {/* Sign up link */}
          <div className="mt-5 text-base font-['Inter'] text-center w-full">
            <span className="text-[#48515c] font-light">
              Already a member?{" "}
            </span>
            <Link href="/signin" className="text-black font-bold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
