import { neon } from "@neondatabase/serverless";
import { verify } from "jsonwebtoken";

export async function POST(req) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) throw new Error("Token missing");

    const decoded = verify(token, process.env.JWT_SECRET);
    const student_id = decoded.userId;

    const { assignment_id, brief, start_date, end_date } = await req.json();

    if (!assignment_id || !brief) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing data" }),
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    // Check if guidance already exists
    const existing = await sql(
      `SELECT guidance FROM student_assignment_guidance WHERE student_id = $1 AND assignment_id = $2`,
      [student_id, assignment_id]
    );

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ success: true, guidance: existing[0].guidance }),
        { status: 200 }
      );
    }

    // Build prompt for AI
    const prompt = `You're helping a student complete this assignment:
Brief: ${brief}
Start Date: ${start_date}
End Date: ${end_date}

Return the output as an array of steps in this JSON format:

[
  {
    "title": "Step 1: Understand the Requirements",
    "start": "2025-04-01",
    "end": "2025-04-02",
    "tasks": [
      "Read the assignment brief carefully",
      "Highlight key entities (e.g., seat bookings, ticket sales)"
    ]
  },
  {
    "title": "Step 2: Design Database Schema",
    "start": "2025-04-03",
    "end": "2025-04-06",
    "tasks": [
      "Define tables and relationships",
      "Draw an ER diagram"
    ]
  }
]

Do not add any text outside the JSON. Only return clean JSON.`;

    // Call AI (OpenRouter)
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "system",
            content: "You are an academic planning assistant.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const aiData = await aiRes.json();
    const guidanceJson = JSON.stringify(
      JSON.parse(aiData?.choices?.[0]?.message?.content)
    );

    if (!guidanceJson) {
      return new Response(
        JSON.stringify({ success: false, message: "AI failed to respond" }),
        { status: 500 }
      );
    }

    // Save it
    await sql(
      `INSERT INTO student_assignment_guidance (student_id, assignment_id, guidance) VALUES ($1, $2, $3)`,
      [student_id, assignment_id, guidanceJson]
    );

    return new Response(
      JSON.stringify({ success: true, guidance: guidanceJson }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Guidance error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
