"use client";

import { useEffect, useState } from "react";
import Subheader from "@/app/ui/components/Subheader";
import Button from "@/app/ui/components/Button";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB");
};

const StudentDashboard = () => {
  const [assignmentsByModule, setAssignmentsByModule] = useState({});
  const [loadingGuidance, setLoadingGuidance] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [expanded, setExpanded] = useState({});
  const [customDates, setCustomDates] = useState({});

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await fetch("/api/student/assignments");
      const data = await res.json();

      if (data.success) {
        const savedProgress = JSON.parse(
          localStorage.getItem("guidance_progress") || "{}"
        );
        setCheckedSteps(savedProgress);

        const grouped = data.data.reduce((acc, assignment) => {
          const moduleName = assignment.module_name || "Unknown Module";
          if (!acc[moduleName]) acc[moduleName] = [];
          acc[moduleName].push({
            ...assignment,
            learning_outcomes: assignment.learning_outcomes || [],
            marking_criteria: assignment.marking_criteria || [],
          });
          return acc;
        }, {});
        setAssignmentsByModule(grouped);
      }
    };

    fetchAssignments();
  }, []);

  const handleStepToggle = (assignmentId, sectionIndex, taskIndex) => {
    const updated = { ...checkedSteps };
    const key = `${sectionIndex}-${taskIndex}`;
    if (!updated[assignmentId]) updated[assignmentId] = [];

    updated[assignmentId] = updated[assignmentId].includes(key)
      ? updated[assignmentId].filter((i) => i !== key)
      : [...updated[assignmentId], key];

    setCheckedSteps(updated);
    localStorage.setItem("guidance_progress", JSON.stringify(updated));
  };

  const handleDateChange = (assignmentId, type, value) => {
    setCustomDates((prev) => ({
      ...prev,
      [assignmentId]: { ...prev[assignmentId], [type]: value },
    }));
  };

  const generateGuidance = async (assignment) => {
    setLoadingGuidance(assignment.assignment_id);
    const custom = customDates[assignment.assignment_id];
    const start_date = custom?.start_date || assignment.start_date;
    const end_date = custom?.end_date || assignment.end_date;

    const res = await fetch("/api/student/guidance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignment_id: assignment.assignment_id,
        brief: assignment.brief,
        start_date,
        end_date,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setAssignmentsByModule((prev) => {
        const updated = { ...prev };
        for (let module in updated) {
          updated[module] = updated[module].map((a) =>
            a.assignment_id === assignment.assignment_id
              ? { ...a, guidance: data.guidance }
              : a
          );
        }
        return updated;
      });

      setCheckedSteps((prev) => ({
        ...prev,
        [assignment.assignment_id]: [],
      }));
    }

    setLoadingGuidance(null);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Subheader title="My Assignments" />
      <div className="mt-6 px-6 pb-12">
        {Object.entries(assignmentsByModule).map(([module, assignments]) => (
          <div key={module} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{module}</h2>

            <div className="grid gap-6">
              {assignments.map((assignment) => {
                let guidanceSteps = [];
                try {
                  guidanceSteps = assignment.guidance
                    ? JSON.parse(assignment.guidance)
                    : [];
                } catch (e) {
                  console.error("Invalid guidance JSON", e);
                }

                const completed = checkedSteps[assignment.assignment_id] || [];
                const total = guidanceSteps.reduce(
                  (sum, sec) => sum + (sec.tasks?.length || 0),
                  0
                );
                const isOpen = expanded[assignment.assignment_id] || false;

                return (
                  <div
                    key={assignment.assignment_id}
                    className={`border-l-4 ${
                      assignment.guidance
                        ? "border-green-400"
                        : "border-gray-300"
                    } border border-gray-300 rounded-xl bg-white transition`}
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-xl"
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [assignment.assignment_id]: !isOpen,
                        }))
                      }
                    >
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {assignment.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(assignment.start_date)} –{" "}
                          {formatDate(assignment.end_date)}
                        </p>
                      </div>
                      <img
                        src="/icons/arrow_drop_down.svg"
                        alt="dropdown"
                        className="w-6 h-6"
                      />
                    </div>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 space-y-4">
                        <p className="text-sm text-gray-700">
                          {assignment.brief}
                        </p>

                        {assignment.learning_outcomes?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">
                              Learning Outcomes:
                            </h4>
                            <ul className="list-disc pl-6 text-sm text-gray-700 mt-1">
                              {assignment.learning_outcomes.map((obj, i) => (
                                <li key={i}>{obj}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {assignment.marking_criteria?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">
                              Marking Criteria:
                            </h4>
                            <ul className="list-disc pl-6 text-sm text-gray-700 mt-1">
                              {assignment.marking_criteria.map((mc, i) => (
                                <li key={i}>
                                  {mc.criteria} — {mc.weightage}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {assignment.guidance && (
                          <div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 transition-all"
                                style={{
                                  width: `${
                                    (completed.length / total) * 100 || 0
                                  }%`,
                                }}
                              ></div>
                            </div>

                            <div className="space-y-4 mt-4">
                              {guidanceSteps.map((section, sIndex) => (
                                <div key={sIndex} className="border rounded-md">
                                  <div className="bg-gray-100 px-4 py-2 font-medium text-sm">
                                    {section.title}
                                    {section.start && section.end && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({formatDate(section.start)} –{" "}
                                        {formatDate(section.end)})
                                      </span>
                                    )}
                                  </div>
                                  <ul className="p-4 space-y-2">
                                    {section.tasks?.map((task, tIndex) => {
                                      const stepKey = `${sIndex}-${tIndex}`;
                                      return (
                                        <li
                                          key={tIndex}
                                          className={`flex items-start gap-2 px-2 py-1 rounded ${
                                            completed.includes(stepKey)
                                              ? "bg-green-50 border border-green-200"
                                              : ""
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={completed.includes(
                                              stepKey
                                            )}
                                            onChange={() =>
                                              handleStepToggle(
                                                assignment.assignment_id,
                                                sIndex,
                                                tIndex
                                              )
                                            }
                                            className="mt-1"
                                          />
                                          <span className="text-sm text-gray-800">
                                            {task}
                                          </span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                          <div className="flex gap-4">
                            <input
                              type="date"
                              defaultValue={assignment.start_date}
                              onChange={(e) =>
                                handleDateChange(
                                  assignment.assignment_id,
                                  "start_date",
                                  e.target.value
                                )
                              }
                              className="border px-2 py-1 rounded text-sm"
                            />
                            <input
                              type="date"
                              defaultValue={assignment.end_date}
                              onChange={(e) =>
                                handleDateChange(
                                  assignment.assignment_id,
                                  "end_date",
                                  e.target.value
                                )
                              }
                              className="border px-2 py-1 rounded text-sm"
                            />
                          </div>
                          <Button
                            onClick={() => generateGuidance(assignment)}
                            disabled={
                              loadingGuidance === assignment.assignment_id
                            }
                          >
                            {loadingGuidance === assignment.assignment_id
                              ? "Regenerating..."
                              : assignment.guidance
                              ? "Regenerate Guidance"
                              : "Generate Guidance"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
