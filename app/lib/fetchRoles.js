"use client";

export async function fetchRoles() {
  try {
    const response = await fetch("/api/roles");
    const data = await response.json();
    if (data.success) {
      return data.data.map((role) => ({
        value: role.role_name,
        label: role.role_name,
      }));
    } else {
      throw new Error(data.message || "Failed to fetch roles");
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}
