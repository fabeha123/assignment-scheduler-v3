"use client";

import React, { useState } from "react";
import SigninForm from "../../ui/forms/SigninForm";

const SigninScreen = () => {
  const [error, setError] = useState("");

  const handleFormSuccess = async (formData) => {
    setError("");

    const response = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
    } else {
      window.location.href = "/staff";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-[440px] h-auto p-4">
        {/* Heading block */}
        <div className="mb-10">
          <div className="text-black text-5xl font-semibold font-['Inter']">
            Sign in
          </div>
          <div className="mt-5">
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

        {/* Show Error Message if Sign-in Fails */}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* sign-in form */}
        <SigninForm onSuccess={handleFormSuccess} />
      </div>
    </div>
  );
};

export default SigninScreen;
