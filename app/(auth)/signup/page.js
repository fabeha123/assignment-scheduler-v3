"use client";

import React, { useState, useEffect, Suspense } from "react";
import useClientSearchParams from "@/app/hooks/useClientSearchParams";
import SignupForm from "@/app/ui/forms/SignupForm";
import Link from "next/link";

const SignupScreen = () => {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <SignupContent />
    </Suspense>
  );
};

const SignupContent = () => {
  const searchParams = useClientSearchParams();
  const [token, setToken] = useState(null);
  const [preloadedData, setPreloadedData] = useState({
    fullname: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams && searchParams.token) {
      setToken(searchParams.token);
    } else if (searchParams !== null) {
      setError("Invalid signup link.");
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (token) {
      // console.log(token);
      fetch(`/api/staff/${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPreloadedData({ fullname: data.full_name, email: data.email });
          } else {
            return fetch(`/api/student/${token}`)
              .then((response) => response.json())
              .then((studentData) => {
                if (studentData.success) {
                  setPreloadedData({
                    fullname: studentData.full_name,
                    email: studentData.email,
                  });
                } else {
                  setError("Invalid or expired signup link.");
                }
              });
          }
        })
        .catch(() => setError("Failed to verify token."))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return error ? (
    <div className="text-center text-red-600">{error}</div>
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-[440px] h-auto p-4">
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

        <SignupForm preloadedData={preloadedData} token={token} />

        <div className="mt-5 text-base font-['Inter'] text-center w-full">
          <span className="text-[#48515c] font-light">Already a member? </span>
          <Link href="/signin" className="text-black font-bold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
