"use client";

import { useState } from "react";
import Subheader from "../../../ui/components/Subheader";
import UploadBox from "@/app/ui/components/UploadBox";
import CourseTable from "@/app/ui/tables/CourseTable";

const ImportCoursesScreen = () => {
  const [courses, setCourses] = useState([]);

  const handleDataParsed = (parsedCourses) => {
    const processedCourses = parsedCourses.map((course) => ({
      ...course,
      start_date: formatDate(course.start_date),
      end_date: formatDate(course.end_date),
      duration: calculateDuration(course.start_date, course.end_date),
    }));

    setCourses(processedCourses);
  };

  // Function to Format Date
  const formatDate = (date) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "—" : parsedDate.toISOString().split("T")[0];
  };

  // Function to Calculate Duration (Years/Months)
  const calculateDuration = (start, end) => {
    if (!start || !end) return "Unknown";

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) return "Unknown";

    const diffYears = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);

    return diffYears >= 1
      ? `${diffYears.toFixed(1)} years`
      : `${Math.round(diffYears * 12)} months`;
  };

  const handleImport = async () => {
    if (courses.length === 0) {
      alert("No courses to import!");
      return;
    }

    try {
      const response = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courses),
      });

      if (response.ok) {
        alert("Courses imported successfully!");
      } else {
        alert("Failed to import courses.");
      }
    } catch (error) {
      console.error("Error importing courses:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader title="Import Courses" showBackButton />

      {/* Upload Box with Course Fields */}
      <div className="mt-8 w-full px-8">
        <UploadBox
          onDataParsed={handleDataParsed}
          fields={{
            name: 1,
            course_code: 2,
            start_date: 3,
            end_date: 4,
          }}
        />
      </div>

      {courses.length > 0 && (
        <div className="mt-6 px-8">
          <h3 className="text-[#770065] font-semibold">Preview Courses:</h3>
          <CourseTable data={courses} showActions={false} />
        </div>
      )}

      {/* Import Button */}
      {courses.length > 0 && (
        <button
          onClick={handleImport}
          className="mt-6 mx-8 px-6 py-2 bg-[#54b5f6] text-white font-bold rounded-md"
        >
          Import
        </button>
      )}
    </div>
  );
};

export default ImportCoursesScreen;
