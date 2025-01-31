export async function fetchAllAssignments() {
  try {
    const response = await fetch(`/api/assignments`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch assignments");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching all assignments:", error);
    return [];
  }
}
