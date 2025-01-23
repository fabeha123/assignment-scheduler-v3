"use client";

import Sidebar from "../ui/components/Sidebar.js";
import Header from "../ui/components/Header.js";

export default function MainLayout({ children }) {
  return (
    <div className="">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}
