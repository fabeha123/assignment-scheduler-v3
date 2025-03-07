"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({
    fullName: null,
    role: null,
    roleId: null,
  });
  const [permissions, setPermissions] = useState([]);
  const { setCurrentTabAccess } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      try {
        const userRes = await fetch("/api/user", { credentials: "include" });
        if (!userRes.ok) throw new Error("User API request failed");
        const userData = await userRes.json();

        if (userData.success && userData.role_id) {
          setUser({
            fullName: userData.full_name || "User",
            role: userData.role || "User",
            roleId: userData.role_id,
          });

          const permissionsRes = await fetch(
            `/api/permissions/fetchByRole?role_id=${userData.role_id}`
          );
          if (!permissionsRes.ok)
            throw new Error("Permissions API request failed");
          const permissionsData = await permissionsRes.json();

          if (permissionsData.success) {
            setPermissions(permissionsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching user or permissions:", error);
      }
    };

    fetchUserAndPermissions();
  }, []);

  const navLinks = [
    { name: "Home", icon: "/icons/fi_3388614.svg", path: "/", tab: "Home" },
    {
      name: "Students",
      icon: "/icons/fi_17005556.svg",
      path: "/students",
      tab: "Students",
    },
    {
      name: "Staff",
      icon: "/icons/fi_3885079.svg",
      path: "/staff",
      tab: "Staff",
    },
    {
      name: "Courses",
      icon: "/icons/fi_11687169.svg",
      path: "/courses",
      tab: "Courses",
    },
    {
      name: "Modules",
      icon: "/icons/fi_18510745.svg",
      path: "/modules",
      tab: "Modules",
    },
    {
      name: "Assignments",
      icon: "/icons/fi_4279576.svg",
      path: "/assignments",
      tab: "Assignments",
    },
    {
      name: "Permissions",
      icon: "/icons/fi_12019091.svg",
      path: "/permissions",
      tab: "Permissions",
    },
  ];

  const allowedLinks = navLinks.filter((link) => {
    return permissions.some(
      (perm) => perm.tab_name === link.tab && (perm.can_read || perm.can_write)
    );
  });

  const handleTabClick = (tabName) => {
    const tabPermission = permissions.find((perm) => perm.tab_name === tabName);

    let newAccess = "no_access";
    if (tabPermission) {
      newAccess = tabPermission.can_write
        ? "can_edit"
        : tabPermission.can_read
        ? "read_only"
        : "no_access";
    }

    setCurrentTabAccess(newAccess);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "GET" });
      if (response.ok) {
        router.push("/signin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <aside className="w-72 bg-[#FFFFFF] border-r border-gray-300 h-screen flex flex-col">
      {/* User Info Section */}
      <div className="p-4 border-b border-gray-300 h-20 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-400 rounded-full text-white flex items-center justify-center font-bold">
            {user.fullName
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </div>
          <div className="w-52">
            <div className="text-lg font-semibold text-gray-800 truncate">
              {user.fullName ?? "Loading..."}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {user.role ?? "Loading..."}
            </div>
          </div>
        </div>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-gray-600 hover:text-black transition pr-2 mr-10"
        >
          ⋮
        </button>

        {dropdownOpen && (
          <div className="absolute top-16 right-4 bg-white shadow-md rounded-md w-32 py-2 border">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links (Scrollable) */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-4">
          {allowedLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.path}
                onClick={() => handleTabClick(link.tab)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                  pathname === link.path
                    ? "bg-[#d2edff] text-[#408fc3] font-medium"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                <img
                  src={
                    pathname === link.path
                      ? link.icon.replace(".svg", "_active.svg")
                      : link.icon
                  }
                  alt={`${link.name} Icon`}
                  className="w-6 h-6"
                />
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
