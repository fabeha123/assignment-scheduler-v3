import { verify } from "jsonwebtoken";
import { neon } from "@neondatabase/serverless";

export async function GET(req) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token) return new Response("Unauthorized", { status: 401 });

    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const role = decoded.role;
    const sql = neon(process.env.DATABASE_URL);

    let query;
    let params;

    if (role === "Admin") {
      query = `
        SELECT a.assignment_id, a.name AS assignment_name, a.start_date, a.end_date,
               cm.module_code, c.course_code,
               m.module_name, c.name AS course_name
        FROM assignments a
        JOIN courses_modules cm ON cm.module_code = a.module_code
        JOIN course c ON c.course_code = cm.course_code
        JOIN modules m ON m.module_code = cm.module_code
      `;
      params = [];
    } else {
      query = `
        SELECT a.assignment_id, a.name AS assignment_name, a.start_date, a.end_date,
               cm.module_code, c.course_code,
               m.module_name, c.name AS course_name
        FROM staff_coursesmodules scm
        JOIN courses_modules cm ON cm.id = scm.courses_modules_id
        JOIN assignments a ON a.module_code = cm.module_code
        JOIN course c ON c.course_code = cm.course_code
        JOIN modules m ON m.module_code = cm.module_code
        WHERE scm.staff_id = $1
      `;
      params = [userId];
    }

    const result = await sql(query, params);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
