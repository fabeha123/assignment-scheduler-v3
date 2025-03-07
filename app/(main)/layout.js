"use client";

import Sidebar from "../ui/components/Sidebar.js";
import Header from "../ui/components/Header.js";
import { UserProvider } from "@/app/context/UserContext";

export default function MainLayout({ children }) {
  return (
    <UserProvider>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header />

        {/* Main Content (Sidebar + Page Content) */}
        <div className="flex flex-grow overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Page Content - Ensuring full height and proper scrolling */}
          <div className="flex-grow h-full overflow-auto">{children}</div>
        </div>
      </div>
    </UserProvider>
  );
}
