import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const coursesParam = searchParams.get("courses");

    if (!coursesParam) {
      return new Response(
        JSON.stringify({ success: false, message: "No courses provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let coursesArray = [];
    try {
      coursesArray = JSON.parse(coursesParam);
      if (!Array.isArray(coursesArray)) {
        coursesArray = [coursesArray];
      }
    } catch (error) {
      coursesArray = coursesParam.includes(",")
        ? coursesParam.split(",").map((code) => code.trim())
        : [coursesParam];
    }

    if (coursesArray.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No valid course codes provided.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const placeholders = coursesArray.map((_, i) => `$${i + 1}`).join(", ");
    const query = `
      SELECT m.module_name, m.module_code, cm.course_code, cm.id
      FROM courses_modules cm
      JOIN modules m ON cm.module_code = m.module_code
      WHERE cm.course_code IN (${placeholders})
    `;

    const modules = await sql(query, coursesArray);
    const formattedModules = modules.map(
      ({ module_name, module_code, course_code, id }) => ({
        id,
        name: `${module_name} (${module_code}) - ${course_code}`,
      })
    );

    return new Response(
      JSON.stringify({ success: true, data: formattedModules }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/module/fetchByCourses:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch modules by courses",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
