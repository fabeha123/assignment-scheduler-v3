"use client";

import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[873px] bg-white rounded-[10px] shadow-lg relative">
        {/* Header */}
        <div className="w-full h-[60px] bg-white border-b border-[#e8ebf0] rounded-t-[10px] flex items-center px-6">
          <h2 className="text-black text-base font-semibold font-['Inter']">
            {title || "Modal Title"}
          </h2>
          <button
            onClick={onClose}
            className="ml-auto text-[#616263] hover:text-black text-sm"
          >
            Close
          </button>
        </div>

        {/* Content area */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        <div className="w-full h-[60px] bg-white border-t border-[#e8ebf0] rounded-b-[10px] flex items-center justify-end px-6">
          <button
            onClick={onClose}
            className="w-[84px] h-9 bg-[#54b5f6] rounded-[7px] text-white text-[15px] font-bold font-['Inter']"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
