"use client"; // Add this line at the very top of the file
import React, { useState } from "react";
import Button from "./Button";

const Form = ({ children, onSubmit, submitLabel = "Submit" }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-items">{children}</div>
      <div>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};

const InputText = ({
  icon,
  value,
  onChange,
  required = false,
  placeholder = "",
  type = "",
}) => {
  return (
    <div className="relative w-[440px] h-[55px] bg-[#f4f4f4] rounded-[13px] flex items-center px-4 mb-[25px]">
      <img src={icon} />

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-transparent outline-none text-black text-base font-normal font-['Inter'] flex-1 ml-3"
      />
    </div>
  );
};

// Attach input components to Form
Form.InputText = InputText;

export default Form;
