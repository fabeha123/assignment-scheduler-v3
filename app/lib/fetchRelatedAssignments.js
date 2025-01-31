export async function fetchRelatedAssignments(module, startDate, endDate) {
  try {
    if (!module || !startDate || !endDate) return [];

    const response = await fetch(
      `/api/assignments?onlyRelated=true&module=${encodeURIComponent(
        module
      )}&startDate=${startDate}&endDate=${endDate}`
    );
    const data = await response.json();

    if (data.success) {
      return data.data.map((assignment) => ({
        title: assignment.assignment_name,
        start_date: assignment.start_date,
        end_date: assignment.end_date,
      }));
    } else {
      console.error("Failed to fetch assignments:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}
