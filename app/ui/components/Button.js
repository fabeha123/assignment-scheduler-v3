import React from "react";

const Button = ({ variant = "primary", children, onClick }) => {
  const baseStyle =
    "focus:outline-none relative inline-flex items-center justify-center text-center";

  const variantStyles = {
    primary:
      "px-6 h-[55px] bg-[#6ec5ff] rounded-[100px] text-white text-base font-bold font-['Inter']",
    actionBlueFilled:
      "px-4 h-9 bg-[#54b5f6] rounded-[7px] text-white text-[15px] font-normal font-['Inter']",
    actionOutlined:
      "px-4 h-9 bg-white rounded-[7px] border border-[#e8ebf0] text-[#48515c] text-[15px] font-light font-['Inter']",
    textOnly: "text-[#616263] text-[15px] font-light font-['Inter']",
  };

  const styles = `${baseStyle} ${variantStyles[variant]}`;

  return (
    <button className={styles} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
