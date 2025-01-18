import React, { Children } from "react";

const Button = ({ variant = "primary", children, onClick }) => {
    const baseStyle = "rounded-full font-medium focus:outline-none";
    const variantStyles = {
      primary: "w-[440px] h-[55px] bg-[#6ec5ff] rounded-[100px] text-white text-base font-bold font-['Inter']",
      // secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      // outlined: "border border-blue-500 text-blue-500 hover:bg-blue-50",
    };
    
      const styles = `${baseStyle} ${variantStyles[variant]}`;
    
      return (
        <button className={styles} onClick={onClick}>
          {children}
        </button>
      );
};

export default Button; 