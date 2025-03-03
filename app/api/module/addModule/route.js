import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const { module_name, module_code, credits, courses, is_core } =
      await request.json();

    if (
      !module_name ||
      !module_code ||
      !credits ||
      !Array.isArray(courses) ||
      courses.length === 0
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid input data." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = neon(process.env.DATABASE_URL);
    const courseCodes = courses.map((course) => course.value);

    await sql(
      `INSERT INTO modules (module_code, module_name, credits) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (module_code) DO NOTHING`,
      [module_code, module_name, credits]
    );

    await Promise.all(
      courseCodes.map(async (course_code) => {
        await sql(
          `INSERT INTO courses_modules (module_code, course_code, is_core) 
           VALUES ($1, $2, $3) 
           ON CONFLICT (module_code, course_code) 
           DO UPDATE SET is_core = $3`,
          [module_code, course_code, is_core]
        );
      })
    );

    return new Response(
      JSON.stringify({ success: true, message: "Module added successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in /api/module/addModule:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
