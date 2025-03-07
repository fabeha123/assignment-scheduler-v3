"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [currentTabAccess, setCurrentTabAccess] = useState("no_access");

  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      try {
        const userRes = await fetch("/api/user", { credentials: "include" });
        if (!userRes.ok) throw new Error("User API request failed");
        const userData = await userRes.json();

        if (userData.success && userData.role_id) {
          setUser(userData);

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

  const hasAllUsersPermission = permissions.some(
    (perm) => perm.tab_name === "all_users" && perm.can_read
  );

  return (
    <UserContext.Provider
      value={{
        user,
        permissions,
        currentTabAccess,
        setCurrentTabAccess,
        hasAllUsersPermission,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
