"use client";

import Button from "./Button";

const Subheader = ({ title, actionButtons = [] }) => {
  return (
    <div className="w-full h-16 bg-white border-b border-[#e8ebf0] flex items-center justify-between px-6">
      {/* Title */}
      <div className="text-black text-base font-semibold font-['Inter']">
        {title || "Subheader Title"}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {actionButtons.map((button, index) => (
          <Button
            key={index}
            variant={
              button.variant === "blue" ? "actionBlueFilled" : "actionOutlined"
            }
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Subheader;
