"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Form from "../components/Form";
import { useFormState } from "@/app/hooks/useFormState";
import { useSubmitForm } from "@/app/hooks/useSubmitForm";

const SignupForm = ({ preloadedData, token }) => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { formData, handleChange, setFormData } = useFormState({
    fullname: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (preloadedData) {
      setFormData((prev) => ({
        ...prev,
        fullname: preloadedData.fullname || "",
        email: preloadedData.email || "",
      }));
    }
  }, [preloadedData, setFormData]);

  const { handleSubmit } = useSubmitForm("/api/signup", () => {
    alert("Signup successful! Redirecting to login...");
    router.push("/signin");
  });

  return (
    <Form
      onSubmit={(e) => handleSubmit({ token, password: formData.password }, e)}
      submitLabel="Start Scheduling"
    >
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
