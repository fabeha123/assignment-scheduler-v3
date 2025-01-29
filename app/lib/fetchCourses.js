"use client";

export async function fetchCourses() {
  try {
    const response = await fetch("/api/course?onlyNames=true");
    const data = await response.json();
    if (data.success) {
      return data.data.map((course) => ({
        value: course.name,
        label: course.name,
      }));
    } else {
      throw new Error(data.message || "Failed to fetch courses");
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
