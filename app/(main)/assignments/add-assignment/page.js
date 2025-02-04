"use client";

import { useState } from "react";
import Subheader from "../../../ui/components/Subheader";
import AddAssignmentForm from "@/app/ui/forms/AddAssignmentForm/AddAssignmentForm";
import Calendar from "../../../ui/components/Calendar";

const AddAssignmentScreen = () => {
  const [assignments, setAssignments] = useState([]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader title="Add Assignment" showBackButton />
      <div className="flex-1 overflow-auto p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg border border-[#e8ebf0]">
          <AddAssignmentForm setAssignments={setAssignments} />
        </div>
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg border border-[#e8ebf0]">
          <Calendar assignments={assignments} />
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentScreen;
