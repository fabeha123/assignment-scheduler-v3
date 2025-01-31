export async function fetchModules() {
  try {
    const response = await fetch("/api/module?onlyNames=true");
    const data = await response.json();
    if (data.success) {
      return data.data.map((module) => ({
        value: module.module_name,
        label: module.module_name,
      }));
    } else {
      throw new Error(data.message || "Failed to fetch modules");
    }
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}
