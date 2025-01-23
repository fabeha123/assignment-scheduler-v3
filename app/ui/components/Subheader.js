"use client";

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
          <button
            key={index}
            onClick={button.onClick}
            className={`h-9 px-4 rounded-[7px] ${
              button.variant === "blue"
                ? "bg-[#54b5f6] text-white font-normal"
                : "bg-white border border-[#e8ebf0] text-[#48515c] font-light"
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Subheader;
