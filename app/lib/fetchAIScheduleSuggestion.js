// fetchAIScheduleSuggestion.js
export async function fetchAIScheduleSuggestion(formData) {
  try {
    if (!formData.module || !formData.startDate || !formData.endDate) {
      return { success: false, message: "Missing required fields." };
    }

    const response = await fetch("/api/ai-assignment-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module: formData.module,
        startDate: formData.startDate,
        endDate: formData.endDate,
        objectives: formData.objectives,
        brief: formData.brief,
        markingCriteria: formData.markingCriteria,
      }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      return {
        success: true,
        data: data.data,
      };
    } else {
      return {
        success: false,
        message: data.message || "AI could not generate a suggestion.",
      };
    }
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return { success: false, message: "AI request failed." };
  }
}
