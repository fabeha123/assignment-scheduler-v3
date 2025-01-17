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
    <div className="w-full min-h-screen p-5 bg-white rounded-[50px] flex justify-center items-start gap-[46px] overflow-hidden">
      {/* Left Section */}
      <div className="relative flex-1">
        {/* White panel behind */}
        <div className="absolute w-full h-full left-0 top-0 bg-white rounded-[30px]" />
        <div className="absolute w-full h-full left-0 top-0">
          {/* Blue panel */}
          <div className="absolute w-full h-full left-0 top-0 bg-[#bbe4ff] rounded-[30px]" />
          {/* Logo */}
          <div className="w-[91px] h-7 left-[30px] top-[30px] absolute">
            <div className="w-6 h-6 left-0 top-[2px] absolute flex-col justify-start items-start inline-flex overflow-hidden" />
            <img src="/assets/logo.png" />
            <div className="left-[34px] top-0 absolute text-white text-2xl font-normal font-['Gochi Hand']">
              Zippy
            </div>
          </div>
          {/* Banner Image */}
          <img
            className="absolute left-0 top-[226px]"
            style={{ width: "100%", maxWidth: "677px", height: "auto" }}
            src="/assets/banner-image.png"
            alt="Banner"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex-1">
        {/* White panel behind */}
        <div className="absolute w-full h-full left-0 top-0 bg-white rounded-[30px]" />
        {/* Content container */}
        <div className="absolute left-[119px] top-[291px]">
          <div className="absolute top-[137px]">
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
              <Form.InputText
                icon="/icons/fi_103089.svg"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="Password"
                type="password"
              />
            </Form>
          </div>

          {/* Sign in Heading */}
          <div className="w-[242px] h-[107px] left-0 top-0 absolute">
            <div className="left-0 top-0 absolute text-black text-5xl font-semibold font-['Inter']">
              Sign in
            </div>
            <div className="left-0 top-[88px] absolute">
              <span className="text-black text-base font-medium font-['Inter']">
                Sign in with your{" "}
              </span>
              <span className="text-black text-base font-bold font-['Inter']">
                Zippy
              </span>
              <span className="text-black text-base font-medium font-['Inter']">
                {" "}
                account
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <div className="w-[440px] h-[99px] left-0 top-[302px] absolute">
            <div className="left-[101px] top-[80px] absolute">
              <span className="text-[#48515c] text-base font-light font-['Inter']">
                Don’t have an account?
              </span>
              <span className="text-black text-base font-medium font-['Inter']">
                {" "}
              </span>
              <span className="text-black text-base font-bold font-['Inter']">
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninScreen;
