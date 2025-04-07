"use client";

import { useEffect, useState } from "react";
import Subheader from "@/app/ui/components/Subheader";
import Button from "@/app/ui/components/Button";
import Form from "@/app/ui/components/Form";
import { fetchCourses } from "@/app/lib/fetchCourses";
import { fetchModulesByCourses } from "@/app/lib/fetchModulesByCourses";
import { useFetchData } from "@/app/hooks/useFetchData";
import Calendar from "@/app/ui/components/Calendar";

const SetAssignmentDatesScreen = ({ assignmentData, onFinish }) => {
  const { data: courses } = useFetchData(fetchCourses);

  const [formData, setFormData] = useState({
    course: "",
    module: "",
    startDate: "",
    endDate: "",
  });

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submittedAssignment, setSubmittedAssignment] = useState(null);

  useEffect(() => {
    const getModules = async () => {
      if (!formData.course) {
        setModules([]);
        return;
      }
      setLoadingModules(true);
      try {
        const fetchedModules = await fetchModulesByCourses([formData.course]);
        setModules(fetchedModules);
      } catch (error) {
        console.error("Error fetching modules", error);
      } finally {
        setLoadingModules(false);
      }
    };
    getModules();
  }, [formData.course]);

  useEffect(() => {
    const fetchAssignmentsByCourse = async () => {
      if (!formData.course) return;
      try {
        const response = await fetch(
          `/api/assignments?onlyScheduleCheck=true&course=${formData.course}`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setAssignments(result.data);
        } else {
          setAssignments([]);
        }
      } catch (err) {
        console.error("Failed to load assignments for calendar", err);
      }
    };
    fetchAssignmentsByCourse();
  }, [formData.course]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSuggestDates = async () => {
    if (!formData.module || assignments.length === 0) return;

    setLoadingAI(true);
    try {
      const formattedAssignments = assignments
        .map(
          (a) =>
            `${a.assignment_name || a.title}: ${a.start_date} to ${a.end_date}`
        )
        .join("\n");

      const response = await fetch("/api/ai-assignment-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formattedAssignments,
          startDate: formData.startDate,
          endDate: formData.endDate,
          objectives: assignmentData.learningOutcomes || [],
          brief: assignmentData.summary,
          markingCriteria: assignmentData.markingCriteria || [],
        }),
      });

      const result = await response.json();
      if (result.success) {
        const formatDate = (dateStr) => {
          const parts = dateStr.includes("/")
            ? dateStr.split("/")
            : dateStr.split("-");
          if (parts.length !== 3) return "";
          const [dd, mm, yyyy] = parts;
          return `${yyyy}-${mm}-${dd}`;
        };

        const formattedStart = formatDate(result.data.suggested_start_date);
        const formattedEnd = formatDate(result.data.suggested_end_date);

        handleChange("startDate", formattedStart);
        handleChange("endDate", formattedEnd);

        setAiSuggestion(result.data);
      }
    } catch (err) {
      console.error("Error suggesting dates:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.course ||
      !formData.module ||
      !formData.startDate ||
      !formData.endDate
    )
      return;

    const fullAssignment = {
      ...assignmentData,
      courseId: formData.course,
      moduleId: formData.module,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      const response = await fetch("/api/assignments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullAssignment),
      });

      const result = await response.json();
      if (result.success) {
        setSubmittedAssignment(fullAssignment);
      } else {
        alert(result.message || "Failed to save assignment.");
      }
    } catch (err) {
      console.error("Failed to save assignment:", err);
      alert("Internal error.");
    }
  };

  if (submittedAssignment) {
    return (
      <div className="flex flex-col h-screen bg-white p-6 items-center justify-center text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-xl w-full">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Assignment Added Successfully!
          </h2>
          <p className="text-gray-800 mb-4">Here’s what you submitted:</p>

          <div className="text-left text-sm bg-white rounded-md p-4 border text-gray-700">
            <p>
              <strong>Title:</strong> {submittedAssignment.title}
            </p>
            <p>
              <strong>Summary:</strong> {submittedAssignment.summary}
            </p>
            <p>
              <strong>Start Date:</strong> {submittedAssignment.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {submittedAssignment.endDate}
            </p>

            <p className="mt-4 font-semibold">Learning Outcomes:</p>
            <ul className="list-disc pl-5">
              {submittedAssignment.learningOutcomes?.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>

            <p className="mt-4 font-semibold">Marking Criteria:</p>
            <ul className="list-disc pl-5">
              {submittedAssignment.markingCriteria?.map((c, i) => (
                <li key={i}>
                  {c.criteria} – {c.weightage}
                </li>
              ))}
            </ul>
          </div>

          <Button
            className="mt-6"
            onClick={() => (window.location.href = "/assignments")}
          >
            Continue to Assignments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader title="Set Assignment Dates" showBackButton />

      <div className="flex-1 overflow-auto p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg border border-[#e8ebf0] flex flex-col gap-6">
          <Form.InputSelect
            label="Course"
            value={formData.course}
            onChange={(val) => handleChange("course", val)}
            options={courses}
            required
          />

          <Form.InputSelect
            label="Module"
            value={formData.module}
            onChange={(val) => handleChange("module", val)}
            options={modules}
            required
            isDisabled={!formData.course || loadingModules}
            loading={loadingModules}
          />

          <div className="flex gap-4">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSuggestDates}
              disabled={loadingAI || !formData.module}
            >
              {loadingAI ? "Checking..." : "Suggest Dates with AI"}
            </Button>
            {aiSuggestion?.reasoning && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md p-4">
                <h3 className="font-semibold mb-2">📘 AI Recommendation</h3>
                <div className="mb-2">
                  <span className="font-medium">Suggested Start:</span>{" "}
                  {aiSuggestion.suggested_start_date || "N/A"}
                  <br />
                  <span className="font-medium">Suggested End:</span>{" "}
                  {aiSuggestion.suggested_end_date || "N/A"}
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {aiSuggestion.reasoning}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button onClick={handleSubmit}>Finish & Save Assignment</Button>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg border border-[#e8ebf0] overflow-auto">
          <Calendar assignments={assignments} />
        </div>
      </div>
    </div>
  );
};

export default SetAssignmentDatesScreen;
