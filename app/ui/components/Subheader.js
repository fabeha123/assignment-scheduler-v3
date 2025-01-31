"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

const Subheader = ({ title, actionButtons = [], showBackButton = false }) => {
  const router = useRouter();

  return (
    <div className="w-full h-16 bg-white border-b border-[#e8ebf0] flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left Section: Back Button + Title */}
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button variant="iconOnlyOutlined" onClick={() => router.back()}>
            <img src="/icons/arrow_left.svg" />
          </Button>
        )}
        <div className="text-black text-base font-semibold">
          {title || "Subheader Title"}
        </div>
      </div>

      {/* Right Section: Action Buttons */}
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
