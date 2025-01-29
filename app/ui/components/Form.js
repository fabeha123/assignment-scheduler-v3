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
    <form onSubmit={onSubmit} className="relative">
      <div className="form-items grid grid-cols-1 gap-2 mb-2">{children}</div>
      <div className="w-full py-2 px-4 flex justify-end rounded-b-[10px]">
        <Button
          type="submit"
          variant={buttonVariant}
          className="w-[200px] h-[45px]
                     bg-[#f4f4f4] border border-[#e8ebf0] rounded-[13px]"
        >
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
    <div className="relative w-full h-[50px] bg-[#f4f4f4] rounded-[13px] flex items-center px-4">
      {icon && <img src={icon} alt="icon" className="mr-3" />}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-transparent outline-none text-black text-base font-normal font-['Inter'] flex-1"
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
  required = false,
}) => {
  return (
    <div className="w-full h-auto">
      <label className="text-gray-500 text-sm font-light font-['Inter'] block mb-1">
        {label}
      </label>
      <div className="w-full h-[45px] bg-[#f4f4f4] rounded-[13px] px-4 flex items-center">
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="bg-transparent outline-none text-black text-base font-normal font-['Inter'] w-full"
        />
      </div>
    </div>
  );
};

// Dropdown/Select Input Component
const InputSelect = ({
  label = "Modules",
  icon,
  value,
  onChange,
  options = [],
  required = false,
}) => {
  return (
    <div className="w-full">
      <label className="text-gray-500 text-sm font-light font-['Inter'] block mb-1">
        {label}
      </label>
      <div className="w-full h-[45px] bg-[#f4f4f4] rounded-[13px] flex items-center px-4">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="bg-transparent outline-none text-gray-500 text-base font-normal font-['Inter'] w-full"
        >
          <option value="" disabled className="text-gray-500">
            Select Modules
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value} className="text-black">
              {option.label}
            </option>
          ))}
        </select>
        {icon && <img src={icon} alt="icon" className="w-6 h-6 ml-auto" />}
      </div>
    </div>
  );
};

// Multi-select Component
const InputMultiSelect = ({
  label = "Courses",
  options = [],
  value = [],
  onChange,
}) => {
  const handleSelect = (selectedValue) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((item) => item !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  const handleRemove = (removedValue) => {
    onChange(value.filter((item) => item !== removedValue));
  };

  return (
    <div className="w-full">
      <label className="text-gray-500 text-sm font-light block mb-1">
        {label}
      </label>

      {/* Field for browser validation */}
      <input
        type="text"
        name="courses"
        required
        className="hidden"
        value={value.length ? value.join(",") : ""}
        onChange={() => {}}
      />

      {/* Visible custom single select */}
      <div className="w-full h-[45px] bg-[#f4f4f4] rounded-[13px] px-4 flex items-center">
        <select
          onChange={(e) => handleSelect(e.target.value)}
          value="" // Always reset to "" so user can pick multiple
          className="bg-transparent outline-none text-gray-500 text-base
                     font-normal w-full cursor-pointer"
        >
          <option value="" disabled hidden>
            {value.length === 0 ? label : "Add more..."}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((item) => (
            <div
              key={item}
              className="flex items-center w-fit px-3 h-[36px]
                         bg-white border border-[#e8ebf0] rounded-[13px]"
            >
              <span className="text-black text-base font-normal truncate">
                {item}
              </span>
              <button
                type="button"
                className="ml-2 text-black hover:text-red-600"
                onClick={() => handleRemove(item)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Attach input components to Form
Form.InputText = InputText;
Form.InputSelect = InputSelect;
Form.InputTextMain = InputTextMain;
Form.InputMultiSelect = InputMultiSelect;

export default Form;
