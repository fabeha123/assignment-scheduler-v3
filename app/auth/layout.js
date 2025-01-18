"use client";

export default function AuthLayout({ children }) {
  return (
    <div className="w-full min-h-screen p-5 bg-white rounded-[50px] flex overflow-hidden">
      {/* Left Section - Common Layout */}
      <div className="relative w-1/2 flex items-center justify-center">
        <div className="absolute inset-0 bg-white rounded-[30px]" />
        <div className="absolute inset-0 w-[80%] bg-[#bbe4ff] rounded-[30px]" />
        <div className="absolute left-[30px] top-[30px] flex items-center gap-2">
          <img src="/assets/logo.png" alt="Zippy Logo" className="w-6 h-6" />
          <div className="text-white text-2xl font-normal font-['Gochi_Hand']">
            Zippy
          </div>
        </div>
        <div className="relative z-10 flex justify-center">
          <img
            src="/assets/banner-image.png"
            alt="Banner"
            className="max-w-[100%] h-auto"
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
