"use client";

export async function fetchModulesByCourses(selectedCourses) {
  if (
    !selectedCourses ||
    !Array.isArray(selectedCourses) ||
    selectedCourses.length === 0
  ) {
    console.warn(
      "⚠️ fetchModulesByCourses called with invalid selectedCourses:",
      selectedCourses
    );
    return [];
  }

  try {
    console.log("📌 Selected courses:", selectedCourses);

    // Extract only the course values
    const courseParam = selectedCourses.map((c) => c.value).join(",");

    if (!courseParam) {
      console.warn("⚠️ courseParam is empty, skipping API call.");
      return [];
    }

    // Log full request URL before fetching
    const apiUrl = `/api/module?modulesByCourse=${encodeURIComponent(
      courseParam
    )}`;
    console.log("📌 Fetching modules from API:", apiUrl);

    // Call the API
    const response = await fetch(apiUrl);

    console.log("✅ API Response received:", response);

    if (!response.ok) {
      throw new Error(`❌ API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Parsed API Data:", data);

    if (data.success && Array.isArray(data.data)) {
      return data.data.map((module) => ({
        value: module.module_code,
        label: `${module.module_name} (${module.module_code})`,
      }));
    } else {
      throw new Error(data.message || "Failed to fetch modules by course");
    }
  } catch (error) {
    console.error("❌ Error fetching modules by course:", error);
    return [];
  }
}
