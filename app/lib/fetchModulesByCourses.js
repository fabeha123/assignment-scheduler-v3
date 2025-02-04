export async function fetchModulesByCourses(courses) {
  if (!courses || courses.length === 0) return [];

  const courseParam = courses
    .map((c) => (typeof c === "object" && c.value ? c.value : c))
    .join(",");

  const apiUrl = `/api/module?courses=${encodeURIComponent(courseParam)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data.map((module) => ({
        value: module.id,
        label: module.name,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in fetchModulesByCourses:", error);
    throw error;
  }
}
