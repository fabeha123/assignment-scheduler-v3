"use client";

import { useState } from "react";
import Subheader from "../../../ui/components/Subheader";
import UploadBox from "@/app/ui/components/UploadBox";
import ModuleTable from "@/app/ui/tables/ModuleTable";

const ImportModulesScreen = () => {
  const [modules, setModules] = useState([]);

  const handleDataParsed = (parsedModules) => {
    const processedModules = parsedModules.map((module) => ({
      ...module,
    }));

    setModules(processedModules);
  };

  const handleImport = async () => {
    if (modules.length === 0) {
      alert("No modules to import!");
      return;
    }

    try {
      const response = await fetch("/api/module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modules),
      });

      if (response.ok) {
        alert("Courses imported successfully!");
      } else {
        alert("Failed to import modules.");
      }
    } catch (error) {
      console.error("Error importing modules:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader title="Import Modules" showBackButton />

      {/* Upload Box with Course Fields */}
      <div className="mt-8 w-full px-8">
        <UploadBox
          onDataParsed={handleDataParsed}
          fields={{
            module_name: 1,
            module_code: 2,
            credits: 3,
            is_core: 4,
            courses: 5,
          }}
        />
      </div>

      {modules.length > 0 && (
        <div className="mt-6 px-8">
          <h3 className="text-[#770065] font-semibold">Preview Courses:</h3>
          <ModuleTable data={modules} showActions={false} />
        </div>
      )}

      {/* Import Button */}
      {modules.length > 0 && (
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

export default ImportModulesScreen;
