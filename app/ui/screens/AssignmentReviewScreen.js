"use client";

import { useState } from "react";
import Subheader from "@/app/ui/components/Subheader";
import Button from "@/app/ui/components/Button";

const AssignmentReviewScreen = ({ extractedData, onNext }) => {
  const [title, setTitle] = useState(extractedData?.title || "");
  const [summary, setSummary] = useState(extractedData?.summary || "");
  const [learningOutcomes, setLearningOutcomes] = useState(
    extractedData?.learning_outcomes || []
  );
  const [markingCriteria, setMarkingCriteria] = useState(
    extractedData?.marking_criteria || []
  );

  const handleSubmit = () => {
    onNext({ title, summary, learningOutcomes, markingCriteria });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader title="Review Assignment Details" showBackButton />

      <div className="flex-1 overflow-auto p-6 flex flex-col items-center">
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg border border-[#e8ebf0] flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assignment Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brief Summary / Task
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1 w-full h-32 border border-gray-300 p-3 rounded-md resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learning Outcomes
            </label>
            <div className="flex flex-col gap-2">
              {learningOutcomes.map((outcome, index) => (
                <input
                  key={index}
                  type="text"
                  value={outcome}
                  onChange={(e) => {
                    const updated = [...learningOutcomes];
                    updated[index] = e.target.value;
                    setLearningOutcomes(updated);
                  }}
                  className="border border-gray-300 p-2 rounded-md"
                />
              ))}
              <Button
                variant="outline"
                onClick={() => setLearningOutcomes([...learningOutcomes, ""])}
                className="w-fit mt-1"
              >
                + Add Outcome
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marking Criteria
            </label>
            <div className="flex flex-col gap-2">
              {markingCriteria.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Criteria"
                    value={item.criteria}
                    onChange={(e) => {
                      const updated = [...markingCriteria];
                      updated[index].criteria = e.target.value;
                      setMarkingCriteria(updated);
                    }}
                    className="w-2/3 border border-gray-300 p-2 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="%"
                    value={item.weightage?.replace("%", "")}
                    onChange={(e) => {
                      const updated = [...markingCriteria];
                      updated[index].weightage = e.target.value + "%";
                      setMarkingCriteria(updated);
                    }}
                    className="w-1/3 border border-gray-300 p-2 rounded-md"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setMarkingCriteria([
                    ...markingCriteria,
                    { criteria: "", weightage: "" },
                  ])
                }
                className="w-fit mt-1"
              >
                + Add Criteria
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSubmit}>Next: Set Dates</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentReviewScreen;
