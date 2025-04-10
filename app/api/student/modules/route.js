import { neon } from "@neondatabase/serverless";
import { verify } from "jsonwebtoken";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Get JWT from cookie
    const token = request.headers
      .get("cookie")
      ?.split("token=")[1]
      ?.split(";")[0];

    if (!token) throw new Error("Missing token");

    const decoded = verify(token, process.env.JWT_SECRET);
    const studentId = decoded.userId;

    if (decoded.userType !== "student") {
      return new Response(
        JSON.stringify({ success: false, message: "Not a student" }),
        { status: 403 }
      );
    }

    // Fetch the course_modules the student is enrolled in and get their module details
    const results = await sql(
      `
      SELECT m.module_code, m.module_name, cm.is_core, m.credits
      FROM students_coursesmodules scm
      JOIN courses_modules cm ON scm.courses_modules_id = cm.id
      JOIN modules m ON cm.module_code = m.module_code
      WHERE scm.student_id = $1
    `,
      [studentId]
    );

    return new Response(JSON.stringify({ success: true, data: results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching student modules:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch modules." }),
      { status: 500 }
    );
  }
}
