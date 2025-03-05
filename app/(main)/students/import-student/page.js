"use client";

import { useState, useEffect } from "react";
import Subheader from "../../../ui/components/Subheader";
import UploadBox from "@/app/ui/components/UploadBox";
import StudentsTableAllColumns from "@/app/ui/tables/StudentsTableAllColumns";

const ImportStudentScreen = () => {
  const [student, setStudent] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDataParsed = (parsedStudent) => {
    const processedStudent = parsedStudent.map((student) => ({
      student_id: extractText(student.student_id),
      full_name: extractText(student.name),
      email: extractText(student.email),
      courses: student.courses
        ? extractText(student.courses)
            .split(",")
            .map((c) => c.trim())
        : [],
      modules: student.modules
        ? extractText(student.modules)
            .split(",")
            .map((m) => m.trim())
        : [],
    }));

    setStudent(processedStudent);
  };

  const extractText = (value) => {
    if (typeof value === "object" && value !== null) {
      return value.text || "";
    }
    return String(value);
  };

  const handleImport = async () => {
    if (student.length === 0) {
      alert("No students to import!");
      return;
    }

    try {
      const response = await fetch("/api/student/bulkImport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        alert("Students imported successfully!");
      } else {
        alert("Failed to import students.");
      }
    } catch (error) {
      console.error("Error importing students:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader title="Import Students" showBackButton />

      {/* Upload Box for Student Fields */}
      <div className="mt-8 w-full px-8">
        <UploadBox
          onDataParsed={handleDataParsed}
          fields={{
            student_id: 1,
            name: 2,
            email: 3,
            courses: 4,
            modules: 5,
          }}
        />
      </div>

      {/* Preview Table */}
      {student.length > 0 && (
        <div className="mt-6 px-8">
          <h3 className="text-[#770065] font-semibold">Preview Students:</h3>
          <StudentsTableAllColumns data={student} showActions={false} />
        </div>
      )}

      {/* Import Button */}
      {student.length > 0 && (
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

export default ImportStudentScreen;
