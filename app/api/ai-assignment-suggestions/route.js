import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      formattedAssignments,
      startDate,
      endDate,
      objectives,
      markingCriteria,
      brief,
    } = await request.json();

    const prompt = `
      You are an AI scheduler helping university staff assign fair and realistic coursework timelines for university students.
        
      The students belong to a mixed-ability cohort (including 1st Class, 2:1, and 2:2 performers). Suggest a schedule that is fair, non-overlapping, and allows an average student to succeed.
        
      Here is a list of existing assignments:
      ${formattedAssignments || "None"}
        
      Assignment Details:
      - Preferred Start Date: ${startDate}
      - Preferred End Date: ${endDate}
      - Objectives: ${objectives.join(", ")}
      - Marking Criteria: ${markingCriteria
        .map((c) => `${c.criteria} (${c.weightage})`)
        .join(", ")}
      - Brief: ${brief}
      
      Your task:
      1. Suggest realistic start and end dates avoiding overlap with existing deadlines.
      2. Ensure a **7–14 day gap** between assignments, adjusting for task complexity.
      3. Only return **valid JSON** using this format:
      
      {
        "suggested_start_date": "dd-mm-yyyy",
        "suggested_end_date": "dd-mm-yyyy",
        "reasoning": "Your logic here."
      }
      `;

    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://assignment-scheduler-v3.vercel.app/",
          "X-Title": "Assignment Scheduler",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            {
              role: "system",
              content: "You are an expert academic AI scheduler.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      }
    );

    const result = await aiResponse.json();
    const text = result?.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json(
        { success: false, message: "No AI output." },
        { status: 500 }
      );
    }

    const match =
      text.match(/```json\n([\s\S]+?)\n```/) || text.match(/({[\s\S]+})/);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "AI response did not contain JSON." },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Failed to parse AI response JSON." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: parsed }, { status: 200 });
  } catch (error) {
    console.error("Error in AI assignment suggestion API:", error);
    return NextResponse.json(
      { success: false, message: "AI scheduling failed." },
      { status: 500 }
    );
  }
}
