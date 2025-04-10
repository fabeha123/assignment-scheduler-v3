"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setUser({ fullName: data.full_name, role: data.role });
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "GET" });
    router.push("/signin");
  };

  return (
    <header className="w-full h-16 bg-[#6ec5ff] flex items-center px-4 md:px-6 justify-between">
      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="Logo" className="w-5 h-5" />
        <div className="text-white text-xl md:text-2xl font-normal font-['Gochi Hand']">
          Zippy
        </div>
      </div>

      {/* Right: Logout for Students */}
      {user?.role === "student" && (
        <button
          onClick={handleLogout}
          className="text-white text-sm hover:underline"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
