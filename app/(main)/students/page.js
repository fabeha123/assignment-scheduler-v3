"use client";

import Subheader from "../../ui/components/Subheader";
import StudentsTable from "../../ui/tables/StudentsTable";

const StudentsScreen = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Students"
        actionButtons={[
          {
            label: "Add New Student",
            variant: "outlined",
            onClick: () => console.log("Add New Student"),
          },
          {
            label: "Import",
            variant: "blue",
            onClick: () => console.log("Import"),
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        {/* Add filter and sort functions */}
        <StudentsTable />
      </div>
    </div>
  );
};

export default StudentsScreen;
