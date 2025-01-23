"use client";

import React from "react";
import SigninForm from "../../ui/forms/SigninForm.js";
import Link from "next/link";

const SigninScreen = () => {
  const handleFormSuccess = (formData) => {
    console.log("Form data received in parent:", formData);
    // API or Database stuff
  };

  return (
    <div>
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

      <SigninForm onSuccess={handleFormSuccess} />

      <div className="mt-5 text-base font-['Inter'] text-center w-full">
        <span className="text-[#48515c] font-light">
          Don’t have an account?{" "}
        </span>
        <Link href="/signup" className="text-black font-bold">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default SigninScreen;
