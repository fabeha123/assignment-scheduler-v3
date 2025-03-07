import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const onlyNames = searchParams.get("onlyNames");

    const userId = request.headers.get("X-User-Id");
    const hasAllUsersPermission = request.headers.get("X-All-Users") === "true";

    if (onlyNames) {
      const query = `SELECT module_name FROM modules ORDER BY module_name ASC`;
      const modules = await sql(query);

      return new Response(JSON.stringify({ success: true, data: modules }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    let query;
    let queryParams = [];

    if (hasAllUsersPermission) {
      query = `
        SELECT 
          m.module_name, 
          m.module_code, 
          m.credits, 
          CASE WHEN bool_or(cm.is_core) THEN 'Yes' ELSE 'No' END AS is_core,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT('course_code', c.course_code, 'course_name', c.name)
            ) FILTER (WHERE c.course_code IS NOT NULL),
            '[]'
          ) AS courses
        FROM modules m
        LEFT JOIN courses_modules cm ON m.module_code = cm.module_code
        LEFT JOIN course c ON cm.course_code = c.course_code
        GROUP BY m.module_name, m.module_code, m.credits
        ORDER BY m.module_name;
      `;
    } else {
      query = `
        SELECT 
          m.module_name, 
          m.module_code, 
          m.credits, 
          CASE WHEN bool_or(cm.is_core) THEN 'Yes' ELSE 'No' END AS is_core,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT('course_code', c.course_code, 'course_name', c.name)
            ) FILTER (WHERE c.course_code IS NOT NULL),
            '[]'
          ) AS courses
        FROM modules m
        JOIN courses_modules cm ON m.module_code = cm.module_code
        JOIN staff_coursesmodules scm ON cm.id = scm.courses_modules_id
        LEFT JOIN course c ON cm.course_code = c.course_code
        WHERE scm.staff_id = $1
        GROUP BY m.module_name, m.module_code, m.credits
        ORDER BY m.module_name;
      `;
      queryParams.push(userId);
    }

    const modules = await sql(query, queryParams);

    return new Response(JSON.stringify({ success: true, data: modules }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in /api/module/fetchModules:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch modules" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
