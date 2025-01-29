"use client";

import React from "react";

const ModuleModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[873px] bg-white rounded-[10px] shadow-lg relative">
        {/* Header */}
        <div className="w-full h-[89px] bg-white border-b border-[#e8ebf0] rounded-t-[10px] flex items-center px-6">
          <h2 className="text-black text-base font-semibold font-['Inter']">
            Add Module
          </h2>
          <button
            onClick={onClose}
            className="ml-auto text-[#616263] hover:text-black text-sm"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default ModuleModal;
