import React, { Children } from "react";

const Button = ({ variant = "primary", size = "medium", children, onClick }) => {
    const baseStyle = "rounded-full font-medium focus:outline-none";
    const variantStyles = {
      primary: "w-[440px] h-[55px] bg-[#6ec5ff] rounded-[100px] text-white text-base font-bold font-['Inter']",
      // secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      // outlined: "border border-blue-500 text-blue-500 hover:bg-blue-50",
    };
    
    // const sizeStyles = {
    //     small: "px-4 py-2 text-sm",
    //     medium: "px-6 py-3 text-base",
    //     large: "px-8 py-4 text-lg",
    //   };
    
      // Combine the styles
      const styles = `${baseStyle} ${variantStyles[variant]}`;
    
      return (
        <button className={styles} onClick={onClick}>
          {children}
        </button>
      );
};

export default Button; 