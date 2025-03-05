import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT 
          students.student_id, 
          students.full_name, 
          students.email,
          students.status, 
          json_agg(DISTINCT jsonb_build_object(
              'course_code', course.course_code,
              'course_name', course.name,
              'modules', (
                  SELECT jsonb_agg(jsonb_build_object(
                      'module_code', modules.module_code,
                      'module_name', modules.module_name,
                      'course_modules_id', courses_modules.id
                  ))
                  FROM modules
                  JOIN courses_modules ON modules.module_code = courses_modules.module_code
                  JOIN students_coursesmodules ON students_coursesmodules.courses_modules_id = courses_modules.id
                  WHERE courses_modules.course_code = course.course_code
                  AND students_coursesmodules.student_id = students.student_id
              )
          )) AS courses
      FROM students
      LEFT JOIN students_coursesmodules ON students_coursesmodules.student_id = students.student_id
      LEFT JOIN courses_modules ON courses_modules.id = students_coursesmodules.courses_modules_id
      LEFT JOIN course ON course.course_code = courses_modules.course_code
      GROUP BY students.student_id;
    `;

    return new Response(
      JSON.stringify({ success: true, data: result }, null, 2),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching student:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch student" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
