"use client";

import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="w-full min-h-screen p-5 bg-white rounded-[50px] flex overflow-hidden">
      {/* Left Section - Common Layout */}
      <div className="relative w-1/2 flex items-center justify-center">
        <div className="absolute inset-0 bg-white rounded-[30px]" />
        <div className="absolute inset-0 w-[80%] bg-[#bbe4ff] rounded-[30px]" />
        <div className="absolute left-[30px] top-[30px] flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="Zippy Logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <div className="text-white text-2xl font-normal font-['Gochi_Hand']">
            Zippy
          </div>
        </div>
        <div className="relative z-10 flex justify-center">
          <Image
            src="/assets/banner-image.png"
            alt="Banner"
            width={800}
            height={400}
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* Right Section - Page Specific Content */}
      <div className="relative w-1/2 flex items-center justify-center">
        <div className="absolute inset-0 bg-white rounded-[30px]" />
        <div className="relative w-[440px] flex flex-col items-start">
          {children}
        </div>
      </div>
    </div>
  );
}
