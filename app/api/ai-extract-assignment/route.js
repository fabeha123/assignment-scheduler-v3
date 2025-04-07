// app/api/ai-extract-assignment/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { brief } = await req.json();

    if (!brief) {
      return NextResponse.json(
        { success: false, message: "No brief provided." },
        { status: 400 }
      );
    }

    const prompt = `
You are an AI assistant helping university staff extract structured data from assignment briefs.

Extract the following fields:
1. Assignment Title
2. Summary (brief description of the task)
3. Learning Outcomes (as an array)
4. Marking Criteria (as an array of objects with criteria and weightage)

Format your response exactly like this JSON:
{
  "title": "Assignment Title Here",
  "summary": "Short summary of the task",
  "learning_outcomes": ["Outcome 1", "Outcome 2"],
  "marking_criteria": [
    { "criteria": "Criteria Name", "weightage": "Percentage" }
  ]
}

Assignment Brief:
"""
${brief}
"""
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // change if deployed
          "X-Title": "Assignment Extractor",
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3-0324",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant that extracts structured assignment information from university-level documents.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      }
    );

    const result = await response.json();
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
        { success: false, message: "JSON block not found in AI response." },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch (e) {
      console.error("Parsing failed:", e);
      return NextResponse.json(
        { success: false, message: "Failed to parse AI response JSON." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: parsed }, { status: 200 });
  } catch (err) {
    console.error("AI extraction error:", err);
    return NextResponse.json(
      { success: false, message: "Internal error." },
      { status: 500 }
    );
  }
}
