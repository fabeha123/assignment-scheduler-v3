import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const requestData = await request.json();
    if (!Array.isArray(requestData)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid input format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = neon(process.env.DATABASE_URL);
    const errors = [];

    for (const moduleData of requestData) {
      const { module_name, module_code, credits, courses, is_core } = module;

      if (!module_name || !module_code || !credits || !courses) {
        errors.push({ module_code, message: "Missing required fields" });
        continue;
      }

      let courseCodes = courses
        .split(",")
        .map((code) => code.trim())
        .filter(Boolean);

      const placeholders = courseCodes.map((_, i) => `$${i + 1}`).join(", ");
      const existingRows = await sql(
        `SELECT course_code FROM course WHERE course_code IN (${placeholders})`,
        courseCodes
      );
      const existingCodes = existingRows.map((row) => row.course_code);
      const missingCodes = courseCodes.filter(
        (code) => !existingCodes.includes(code)
      );

      if (missingCodes.length > 0) {
        errors.push({
          module_code,
          message: `Invalid course codes: ${missingCodes.join(", ")}`,
        });
        continue;
      }

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
             DO UPDATE SET is_core = EXCLUDED.is_core`,
            [module_code, course_code, is_core]
          );
        })
      );
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bulk modules added successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in /api/module/bulkImport:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
