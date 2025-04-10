import { neon } from "@neondatabase/serverless";
import { verify } from "jsonwebtoken";

export async function GET(request) {
  try {
    const token = request.headers
      .get("cookie")
      ?.split("token=")[1]
      ?.split(";")[0];

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Token missing" }),
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "student") {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 403 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    const result = await sql(
      `
  SELECT 
    a.assignment_id,
    a.name,
    a.brief,
    a.start_date,
    a.end_date,
    m.module_name,
    (
      SELECT guidance 
      FROM student_assignment_guidance sag
      WHERE sag.assignment_id = a.assignment_id
        AND sag.student_id = $1
      ORDER BY sag.created_at DESC
      LIMIT 1
    ) as guidance,
    COALESCE(
      json_agg(DISTINCT ao.objective) 
      FILTER (WHERE ao.objective IS NOT NULL), 
      '[]'
    ) AS learning_outcomes,
    COALESCE(
      json_agg(DISTINCT jsonb_build_object('criteria', amc.criteria, 'weightage', amc.weightage)) 
      FILTER (WHERE amc.criteria IS NOT NULL), 
      '[]'
    ) AS marking_criteria
  FROM assignments a
  LEFT JOIN assignment_objectives ao ON ao.assignment_id = a.assignment_id
  LEFT JOIN assignment_marking_criteria amc ON amc.assignment_id = a.assignment_id
  LEFT JOIN modules m ON m.module_code = a.module_code
  WHERE a.module_code = ANY (
    SELECT cm.module_code
    FROM students_coursesmodules scm
    JOIN courses_modules cm ON scm.courses_modules_id = cm.id
    WHERE scm.student_id = $1
  )
  GROUP BY a.assignment_id, m.module_name;
`,
      [decoded.userId]
    );

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Assignment fetch error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch assignments",
      }),
      { status: 500 }
    );
  }
}
