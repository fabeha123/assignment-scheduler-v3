import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const userId = request.headers.get("X-User-Id");

    const hasAllUsersPermission = request.headers.get("X-All-Users") === "true";

    let query;
    let queryParams = [];

    if (hasAllUsersPermission) {
      query = `
        SELECT 
            s.student_id, 
            s.full_name, 
            s.email,
            s.status, 
            json_agg(DISTINCT jsonb_build_object(
                'course_code', c.course_code,
                'course_name', c.name,
                'modules', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'module_code', m.module_code,
                        'module_name', m.module_name,
                        'course_modules_id', cm.id
                    ))
                    FROM modules m
                    JOIN courses_modules cm ON m.module_code = cm.module_code
                    JOIN students_coursesmodules scm ON scm.courses_modules_id = cm.id
                    WHERE cm.course_code = c.course_code
                    AND scm.student_id = s.student_id
                )
            )) AS courses
        FROM students s
        LEFT JOIN students_coursesmodules scm ON scm.student_id = s.student_id
        LEFT JOIN courses_modules cm ON cm.id = scm.courses_modules_id
        LEFT JOIN course c ON c.course_code = cm.course_code
        GROUP BY s.student_id;
      `;
    } else {
      query = `
        SELECT 
            s.student_id, 
            s.full_name, 
            s.email,
            s.status, 
            json_agg(DISTINCT jsonb_build_object(
                'course_code', c.course_code,
                'course_name', c.name,
                'modules', (
                    SELECT jsonb_agg(jsonb_build_object(
                        'module_code', m.module_code,
                        'module_name', m.module_name,
                        'course_modules_id', cm.id
                    ))
                    FROM modules m
                    JOIN courses_modules cm ON m.module_code = cm.module_code
                    JOIN students_coursesmodules scm ON scm.courses_modules_id = cm.id
                    WHERE cm.course_code = c.course_code
                    AND scm.student_id = s.student_id
                )
            )) AS courses
        FROM students s
        JOIN students_coursesmodules scm ON scm.student_id = s.student_id
        JOIN courses_modules cm ON cm.id = scm.courses_modules_id
        JOIN staff_coursesmodules staff_cm ON staff_cm.courses_modules_id = cm.id
        JOIN course c ON c.course_code = cm.course_code
        WHERE staff_cm.staff_id = $1
        GROUP BY s.student_id;
      `;
      queryParams.push(userId);
    }

    const result = await sql(query, queryParams);

    return new Response(
      JSON.stringify({ success: true, data: result }, null, 2),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch students" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
