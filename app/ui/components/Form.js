"use client";

import React from "react";
import Button from "./Button";

const Form = ({
  children,
  onSubmit,
  submitLabel = "Submit",
  buttonVariant = "primary",
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-items">{children}</div>
      <div>
        <Button type="submit" variant={buttonVariant}>
          {submitLabel}
        </Button>
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
  type = "text",
}) => {
  return (
    <div className="relative w-[440px] h-[55px] bg-[#f4f4f4] rounded-[13px] flex items-center px-4 mb-[25px]">
      {icon && <img src={icon} alt="icon" />}

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

// Main Text Input Component
const InputTextMain = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) => {
  return (
    <div className="relative w-full max-w-[390px] h-[66px] mb-6">
      <label className="absolute top-0 left-3 text-black text-[13px] font-light font-['Inter']">
        {label}
      </label>
      <div className="absolute top-[21px] w-full max-w-[390px] h-[45px] bg-[#f4f4f4] rounded-[13px] px-4 flex items-center">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent outline-none text-black text-base font-normal font-['Inter'] w-full"
        />
      </div>
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
Form.InputTextMain = InputTextMain;

export default Form;
