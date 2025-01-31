"use client";

import { useState, useEffect } from "react";
import Form from "../../components/Form";
import Button from "../../components/Button";
import { fetchModules } from "@/app/lib/fetchModules";
import { fetchRelatedAssignments } from "@/app/lib/fetchRelatedAssignments";
import { fetchAIScheduleSuggestion } from "@/app/lib/fetchAIScheduleSuggestion";

import AssignmentDetailsSection from "./AssignmentDetailsSection";
import ObjectivesSection from "./ObjectivesSection";
import MarkingCriteriaSection from "./MarkingCriteriaSection";
import AISuggestionSection from "./AISuggestionSection";

const AddAssignmentForm = ({ setAssignments }) => {
  const [formData, setFormData] = useState({
    name: "",
    weightage: "",
    module: "",
    startDate: "",
    endDate: "",
    objectives: [""],
    brief: "",
    markingCriteria: [{ criteria: "", weightage: "" }],
  });

  const [modules, setModules] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [aiSuggestion, setAISuggestion] = useState(null); // AI suggestion

  // -- Fetch modules for dropdown
  useEffect(() => {
    const getModules = async () => {
      const moduleList = await fetchModules();
      setModules(moduleList);
    };
    getModules();
  }, []);

  // -- Fetch assignments automatically when module/dates change
  useEffect(() => {
    if (formData.module && formData.startDate && formData.endDate) {
      fetchAssignments(formData.module, formData.startDate, formData.endDate);
    }
  }, [formData.module, formData.startDate, formData.endDate]);

  const fetchAssignments = async (module, startDate, endDate) => {
    if (!module || !startDate || !endDate) return;
    const assignments = await fetchRelatedAssignments(
      module,
      startDate,
      endDate
    );
    setAssignments(assignments);
  };

  // -- General Form Change
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -- Ask AI
  const handleAISuggestion = async (e) => {
    e.preventDefault();
    if (!formData.module || !formData.startDate || !formData.endDate) {
      setAISuggestion({
        message: "Please provide module, start date, and end date.",
        reason: "",
      });
      return;
    }
    const aiResponse = await fetchAIScheduleSuggestion(formData);
    if (aiResponse.success) {
      setAISuggestion(aiResponse.data);
    } else {
      setAISuggestion({
        message: "AI was unable to generate a suggestion.",
        reason: "Try adjusting the assignment details.",
      });
    }
  };

  // -- Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Assignment added successfully!");
        setFormData({
          name: "",
          weightage: "",
          module: "",
          startDate: "",
          endDate: "",
          objectives: [""],
          brief: "",
          markingCriteria: [{ criteria: "", weightage: "" }],
        });
        setAssignments([]);
        setAISuggestion(null);
      } else {
        setErrorMessage(data.message || "Failed to add assignment.");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      submitLabel="Add Assignment"
      buttonVariant="actionBlueFilled"
    >
      <AssignmentDetailsSection
        formData={formData}
        onChange={handleChange}
        modules={modules}
      />

      <ObjectivesSection
        objectives={formData.objectives}
        setFormData={setFormData}
      />

      <div>
        <label className="text-gray-500 text-sm font-light block mb-1">
          Assignment Brief
        </label>
        <textarea
          value={formData.brief}
          onChange={(e) => handleChange("brief", e.target.value)}
          placeholder="Enter brief details..."
          required
          className="w-full h-32 bg-[#f4f4f4] rounded-[13px] px-4 py-3 text-black text-base outline-none"
        />
      </div>

      <MarkingCriteriaSection
        markingCriteria={formData.markingCriteria}
        setFormData={setFormData}
      />

      {/* Success/Error Messages */}
      {successMessage && (
        <p className="text-green-600 mt-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}

      {/* Ask AI Button */}
      <div className="flex justify-end mt-4">
        <Button
          variant="actionOutlined"
          type="button"
          onClick={handleAISuggestion}
        >
          Ask AI
        </Button>
      </div>

      {/* AI Suggestion Box */}
      <AISuggestionSection aiSuggestion={aiSuggestion} />
    </Form>
  );
};

export default AddAssignmentForm;
