import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
SELECT 
    staff.staff_id, 
    staff.full_name, 
    staff.email, 
    staff.status, 
    roles.role_name,
    json_agg(DISTINCT jsonb_build_object(  -- ✅ Use DISTINCT to avoid duplicates
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
            JOIN staff_coursesmodules ON staff_coursesmodules.courses_modules_id = courses_modules.id
            WHERE courses_modules.course_code = course.course_code
            AND staff_coursesmodules.staff_id = staff.staff_id
        )
    )) AS courses
FROM staff 
LEFT JOIN roles ON roles.role_id = staff.role_id
LEFT JOIN staff_coursesmodules ON staff_coursesmodules.staff_id = staff.staff_id
LEFT JOIN courses_modules ON courses_modules.id = staff_coursesmodules.courses_modules_id
LEFT JOIN course ON course.course_code = courses_modules.course_code
GROUP BY staff.staff_id, roles.role_name;

    `;

    console.log(
      "🔍 API Response BEFORE Sending:",
      JSON.stringify(result, null, 2)
    );

    // ✅ Ensure JSON response
    return new Response(
      JSON.stringify({ success: true, data: result }, null, 2),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching staff:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch staff" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
