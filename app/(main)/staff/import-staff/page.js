"use client";

import { useState, useEffect } from "react";
import Subheader from "../../../ui/components/Subheader";
import UploadBox from "@/app/ui/components/UploadBox";
import StaffTableAllColumns from "@/app/ui/tables/StaffTableAllColumns";

const ImportStaffScreen = () => {
  const [staff, setStaff] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDataParsed = (parsedStaff) => {
    const processedStaff = parsedStaff.map((staffMember) => ({
      name: extractText(staffMember.name),
      email: extractText(staffMember.email),
      role: extractText(staffMember.role),
      courses: staffMember.courses
        ? extractText(staffMember.courses).split(",")
        : [],
      modules: staffMember.modules
        ? extractText(staffMember.modules).split(",")
        : [],
    }));

    setStaff(processedStaff);
  };

  const extractText = (value) => {
    if (typeof value === "object" && value !== null) {
      return value.text || "";
    }
    return String(value);
  };

  const handleImport = async () => {
    if (staff.length === 0) {
      alert("No staff to import!");
      return;
    }

    try {
      const response = await fetch("/api/staff/bulkImport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staff),
      });

      if (response.ok) {
        alert("Staff imported successfully!");
      } else {
        alert("Failed to import staff.");
      }
    } catch (error) {
      console.error("Error importing staff:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader title="Import Staff" showBackButton />

      {/* Upload Box for Staff Fields */}
      <div className="mt-8 w-full px-8">
        <UploadBox
          onDataParsed={handleDataParsed}
          fields={{
            name: 1,
            email: 2,
            role: 3,
            courses: 4,
            modules: 5,
          }}
        />
      </div>

      {staff.length > 0 && (
        <div className="mt-6 px-8">
          <h3 className="text-[#770065] font-semibold">Preview Staff:</h3>
          <StaffTableAllColumns data={staff} showActions={false} />
        </div>
      )}

      {/* Import Button */}
      {staff.length > 0 && (
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

export default ImportStaffScreen;
