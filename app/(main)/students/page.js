"use client";

import Subheader from "../../ui/components/Subheader";

const StudentsScreen = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Subheader */}
      <div className="border-b border-[#e8ebf0]">
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
      </div>
    </div>
  );
};

export default StudentsScreen;
