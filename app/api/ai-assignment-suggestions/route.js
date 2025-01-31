import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const { module, startDate, endDate, objectives, markingCriteria, brief } =
      await request.json();

    const sql = neon(process.env.DATABASE_URL);

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const assignmentResponse = await fetch(
      `${baseURL}/api/assignments?onlyScheduleCheck=true&module=${module}`
    );
    const assignmentData = await assignmentResponse.json();
    const existingAssignments = assignmentData.data;

    if (!assignmentData.success || existingAssignments.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No existing assignments found for AI to analyze.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert assignments into a readable format
    const formattedAssignments = existingAssignments
      .map((a) => `${a.assignment_name}: ${a.start_date} to ${a.end_date}`)
      .join("\n");

    // Construct the AI prompt
    const prompt = `
You are an AI scheduler for university assignments.
Here is a list of existing assignments:
${formattedAssignments}

Now, schedule a new assignment:
- Module: ${module}
- Preferred Start Date: ${startDate}
- Preferred End Date: ${endDate}
- Objectives: ${objectives.join(", ")}
- Marking Criteria: ${markingCriteria
      .map((c) => `${c.criteria} (${c.weightage}%)`)
      .join(", ")}
- Brief: ${brief}

Your task:
1. Suggest an improved start and end date ensuring a **2-week gap** between existing assignments, the dates must be in dd-mm-yyyy format.
2. Consider the complexity of the assignment when deciding the duration.
3. Use the below Example Output to respond (no extra text):

\`\`\`json
{
  "suggested_start_date": "10/06/2025",
  "suggested_end_date": "20/06/2025",
  "reasoning": "The assignment complexity requires at least 10 days."
}
\`\`\`
`;

    // Call Hugging Face API for Mistral-7B-Instruct
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.2,
            return_full_text: false,
          },
        }),
      }
    );

    const result = await response.json();

    // Check if the response contains valid text
    const aiResponse = result?.[0]?.generated_text;
    if (!aiResponse) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "AI response was empty or invalid.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract JSON block using regex
    const jsonMatch = aiResponse.match(/```json\n([\s\S]+?)\n```/);
    let aiSuggestion = {
      suggested_start_date: "",
      suggested_end_date: "",
      reasoning: "",
    };

    if (jsonMatch) {
      try {
        aiSuggestion = JSON.parse(jsonMatch[1]); // Extract only the JSON part
      } catch (parseError) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "AI response parsing failed.",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "AI response did not contain valid JSON.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the final suggestion
    return new Response(JSON.stringify({ success: true, data: aiSuggestion }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Minimal error logging in production
    console.error("Error in AI assignment suggestion API:", error);
    return new Response(
      JSON.stringify({ success: false, message: "AI scheduling failed." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
