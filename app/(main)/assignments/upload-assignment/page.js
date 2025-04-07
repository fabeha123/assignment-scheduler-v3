"use client";

import { useState } from "react";
import Subheader from "@/app/ui/components/Subheader";
import Button from "@/app/ui/components/Button";
import AssignmentReviewScreen from "@/app/ui/screens/AssignmentReviewScreen";
import SetAssignmentDatesScreen from "../set-assignment-dates/page";
import mammoth from "mammoth";

const UploadAssignmentScreen = () => {
  const [briefText, setBriefText] = useState("");
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);

  const [reviewData, setReviewData] = useState(null);
  const [finalStepData, setFinalStepData] = useState(null); // NEW

  const handleTextChange = (e) => setBriefText(e.target.value);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setBriefText(result.value);
      } catch (err) {
        console.error("Failed to extract text from .docx", err);
      }
    }
  };

  const handleExtract = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai-extract-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: briefText }),
      });

      const data = await response.json();
      if (data.success) {
        setReviewData(data.data);
      }
    } catch (error) {
      console.error("Extraction failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewConfirm = (data) => {
    setFinalStepData(data);
  };

  const handleFinish = (fullAssignment) => {};

  if (finalStepData) {
    return (
      <SetAssignmentDatesScreen
        assignmentData={finalStepData}
        onFinish={handleFinish}
      />
    );
  }

  if (reviewData) {
    return (
      <AssignmentReviewScreen
        extractedData={reviewData}
        onNext={handleReviewConfirm}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader title="Assignment Brief" showBackButton />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 items-center">
        <div className="w-full md:w-2/3 bg-[#f9fafb] border border-[#e5e7eb] p-4 rounded-lg text-sm text-gray-700">
          📄 Paste the full assignment brief or upload a Word file. We&apos;ll
          extract the title, task summary, learning outcomes, and marking
          criteria.
        </div>

        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg border border-[#e8ebf0] flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Paste Assignment Brief</h2>

          <textarea
            className="w-full h-60 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="Paste the full assignment brief here..."
            value={briefText}
            onChange={handleTextChange}
          />

          <div>
            <label className="block text-sm text-gray-600">
              Or upload a Word document:
            </label>
            <input
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:border file:rounded-md file:border-gray-300 file:bg-gray-50 file:text-sm file:font-medium"
            />
            {fileName && (
              <p className="text-xs mt-1 text-gray-500">Selected: {fileName}</p>
            )}
          </div>

          <div className="mt-6">
            <Button onClick={handleExtract} disabled={loading || !briefText}>
              {loading ? "Extracting..." : "Extract Info"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAssignmentScreen;
