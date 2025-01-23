"use client";
const Header = () => {
  return (
    <header className="w-full h-16 bg-[#6ec5ff] flex flex-wrap items-center px-4 md:px-6">
      {/* Logo and Brand Name */}
      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="Logo" className="w-5 h-5" />
        <div className="text-white text-xl md:text-2xl font-normal font-['Gochi Hand']">
          Zippy
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center w-full md:w-[40%] h-10 bg-[#53b5f6] rounded-md px-4 mx-auto mt-2 md:mt-0">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-white placeholder-white outline-none"
        />
      </div>
    </header>
  );
};
export default Header;
