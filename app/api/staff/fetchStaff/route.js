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
            s.staff_id, 
            s.full_name, 
            s.email, 
            s.status, 
            r.role_name,
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
                    JOIN staff_coursesmodules scm ON scm.courses_modules_id = cm.id
                    WHERE cm.course_code = c.course_code
                    AND scm.staff_id = s.staff_id
                )
            )) AS courses
        FROM staff s
        LEFT JOIN roles r ON r.role_id = s.role_id
        LEFT JOIN staff_coursesmodules scm ON scm.staff_id = s.staff_id
        LEFT JOIN courses_modules cm ON cm.id = scm.courses_modules_id
        LEFT JOIN course c ON c.course_code = cm.course_code
        GROUP BY s.staff_id, r.role_name;
      `;
    } else {
      query = `
        SELECT 
            s.staff_id, 
            s.full_name, 
            s.email, 
            s.status, 
            r.role_name,
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
                    JOIN staff_coursesmodules scm ON scm.courses_modules_id = cm.id
                    WHERE cm.course_code = c.course_code
                    AND scm.staff_id = s.staff_id
                )
            )) AS courses
        FROM staff s
        JOIN staff_coursesmodules scm ON scm.staff_id = s.staff_id
        JOIN courses_modules cm ON cm.id = scm.courses_modules_id
        JOIN staff_coursesmodules logged_in_scm ON logged_in_scm.courses_modules_id = cm.id
        JOIN course c ON c.course_code = cm.course_code
        JOIN roles r ON r.role_id = s.role_id
        WHERE logged_in_scm.staff_id = $1
        GROUP BY s.staff_id, r.role_name;
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
    console.error("❌ Error fetching staff:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch staff" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
