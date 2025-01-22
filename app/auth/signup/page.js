"use client";

import React from "react";
import SignupForm from "../../ui/forms/SignupForm";
import Link from "next/link";

const SignupScreen = () => {
  const handleFormSuccess = (formData) => {
    console.log("Form data received in parent:", formData);
  };

  return (
    <>
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

      <SignupForm onSuccess={handleFormSuccess} />

      <div className="mt-5 text-base font-['Inter'] text-center w-full">
        <span className="text-[#48515c] font-light">Already a member? </span>
        <Link href="/auth/signin" className="text-black font-bold">
          Sign in
        </Link>
      </div>
    </>
  );
};

export default SignupScreen;
