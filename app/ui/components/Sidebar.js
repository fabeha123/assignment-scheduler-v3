"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [studentModules, setStudentModules] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setCurrentTabAccess } = useUser();

  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      try {
        const userRes = await fetch("/api/user", { credentials: "include" });
        const userData = await userRes.json();

        if (userData.success && userData.role_id) {
          setUser({
            fullName: userData.full_name,
            role: userData.role,
            roleId: userData.role_id,
          });

          if (userData.role === "student") {
            const modRes = await fetch("/api/student/modules");
            const modData = await modRes.json();
            if (modData.success) setStudentModules(modData.data);
          } else {
            const permissionsRes = await fetch(
              `/api/permissions/fetchByRole?role_id=${userData.role_id}`
            );
            const permissionsData = await permissionsRes.json();
            if (permissionsData.success) {
              setPermissions(permissionsData.data);
            }
          }
        }
      } catch (err) {
        console.error("Sidebar load error:", err);
      }
    };

    fetchUserAndPermissions();
  }, []);

  const handleTabClick = (tabName) => {
    const tabPermission = permissions.find((p) => p.tab_name === tabName);
    const access = tabPermission?.can_write
      ? "can_edit"
      : tabPermission?.can_read
      ? "read_only"
      : "no_access";

    setCurrentTabAccess(access);
  };

  const handleModuleClick = (moduleCode) => {
    router.push(`/students/student-dashboard?module=${moduleCode}`);
  };

  const handleLogout = async () => {
    const res = await fetch("/api/logout");
    if (res.ok) router.push("/signin");
  };

  if (!user) return null;

  const navLinks = [
    {
      name: "Dashboard",
      icon: "/icons/fi_3388614.svg",
      path: "/dashboard",
      tab: "Dashboard",
    },
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

  const allowedLinks = navLinks.filter((link) =>
    permissions.some(
      (perm) => perm.tab_name === link.tab && (perm.can_read || perm.can_write)
    )
  );

  return (
    <aside className="w-72 bg-white border-r border-gray-300 h-screen flex flex-col">
      {/* Top user info */}
      <div className="p-4 border-b border-gray-300 h-20 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-400 rounded-full text-white flex items-center justify-center font-bold">
            {user.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </div>
          <div className="w-52">
            <div className="text-lg font-semibold text-gray-800 truncate">
              {user.fullName}
            </div>
            <div className="text-sm text-gray-500 truncate">{user.role}</div>
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-4">
          {user.role === "student"
            ? studentModules.map((mod) => (
                <li key={mod.module_code}>
                  <div
                    className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 border hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleModuleClick(mod.module_code)}
                  >
                    📘 <span>{mod.module_name}</span>
                  </div>
                </li>
              ))
            : allowedLinks.map((link, index) => (
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
