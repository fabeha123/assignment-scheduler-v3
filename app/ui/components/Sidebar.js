"use client";

import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", icon: "/icons/fi_3388614.svg", path: "/" },
    { name: "Students", icon: "/icons/fi_17005556.svg", path: "/students" },
    { name: "Staff", icon: "/icons/fi_3885079.svg", path: "/staff" },
    { name: "Courses", icon: "/icons/fi_11687169.svg", path: "/courses" },
    { name: "Modules", icon: "/icons/fi_18510745.svg", path: "/modules" },
    {
      name: "Assignments",
      icon: "/icons/fi_4279576.svg",
      path: "/assignments",
    },
  ];

  return (
    <aside className="w-72 bg-[#FBFBFB] border-r border-gray-300 h-screen flex flex-col">
      {/* User Profile (Set height to match Subheader) */}
      <div className="p-4 border-b border-gray-300 h-16 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-400 rounded-full text-white flex items-center justify-center font-bold">
            FS
          </div>
          <div className="w-72">
            <div className="text-lg font-semibold text-gray-800 truncate">
              Fabeha Saleem
            </div>
            <div className="text-sm text-gray-500 truncate">Admin</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                  pathname === link.path
                    ? "bg-[#d2edff] text-[#408fc3] font-medium"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                {/* Icon */}
                <img
                  src={
                    pathname === link.path
                      ? link.icon.replace(".svg", "_active.svg")
                      : link.icon
                  }
                  alt={`${link.name} Icon`}
                  className="w-6 h-6"
                />
                {/* Link Name */}
                <span>{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
export default Sidebar;
