"use client";
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

// Text Input Component
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

// Dropdown/Select Input Component
const InputSelect = ({
  icon,
  value,
  onChange,
  options = [],
  required = false,
}) => {
  return (
    <div className="relative w-[440px] h-[55px] bg-[#f4f4f4] rounded-[13px] flex items-center px-4 mb-[25px]">
      {icon && <img src={icon} alt="icon" />}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="bg-transparent outline-none text-black text-base font-normal font-['Inter'] flex-1 ml-3"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Attach input components to Form
Form.InputText = InputText;
Form.InputSelect = InputSelect;

export default Form;
