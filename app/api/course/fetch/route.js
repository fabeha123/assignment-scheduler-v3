import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const onlyNames = searchParams.get("onlyNames");

    const userId = request.headers.get("X-User-Id");
    const hasAllUsersPermission = request.headers.get("X-All-Users") === "true";

    let query;
    let queryParams = [];

    if (hasAllUsersPermission) {
      query = `
        SELECT course_code, name, start_date, end_date, duration, created_at
        FROM course
        ORDER BY created_at DESC
      `;
    } else {
      query = `
        SELECT DISTINCT c.course_code, c.name, c.start_date, c.end_date, c.duration, c.created_at
        FROM course c
        JOIN courses_modules cm ON c.course_code = cm.course_code
        JOIN staff_coursesmodules scm ON cm.id = scm.courses_modules_id
        WHERE scm.staff_id = $1
        ORDER BY c.created_at DESC
      `;
      queryParams.push(userId);
    }

    if (onlyNames) {
      query = query.replace(
        "SELECT course_code, name, start_date, end_date, duration, created_at",
        "SELECT name, course_code"
      );
    }

    const courses = await sql(query, queryParams);

    return new Response(JSON.stringify({ success: true, data: courses }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/course/fetch GET:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch courses" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
