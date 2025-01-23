import React from "react";

const Button = ({ variant = "primary", children, onClick }) => {
  const baseStyle =
    "focus:outline-none relative flex items-center justify-center";
  const variantStyles = {
    primary:
      "w-[440px] h-[55px] bg-[#6ec5ff] rounded-[100px] text-white text-base font-bold font-['Inter']",
    actionBlueFilled:
      "w-[84px] h-9 bg-[#54b5f6] rounded-[7px] text-white text-[15px] font-normal font-['Inter']",
    actionOutlined:
      "w-[152px] h-9 bg-white rounded-[7px] border border-[#e8ebf0] text-[#48515c] text-[15px] font-light font-['Inter']",
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
