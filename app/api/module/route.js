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
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    // Fetch course IDs
    const placeholders = courses.map((_, i) => `$${i + 1}`).join(", ");
    const courseResult = await sql(
      `SELECT course_id FROM course WHERE name IN (${placeholders})`,
      courses
    );
    if (!courseResult.length) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No matching courses found.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const courseIds = courseResult.map((c) => c.course_id);

    // Insert into modules
    const moduleResult = await sql(
      `INSERT INTO modules (module_name, module_code, credits) VALUES ($1, $2, $3) RETURNING module_id`,
      [module_name, module_code, credits]
    );

    const moduleId = moduleResult[0].module_id;

    // Insert into courses_modules
    await sql(
      `INSERT INTO courses_modules (module_id, course_id, is_core) VALUES ${courseIds
        .map((_, i) => `($1, $${i + 2}, $${i + 2 + courseIds.length})`)
        .join(", ")}`,
      [
        moduleId,
        ...courseIds,
        ...courseIds.map(() => (is_core ? "true" : "false")),
      ]
    );

    return new Response(
      JSON.stringify({ success: true, message: "Module added successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/modules POST:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Parse query params to check if onlyNames is requested
    const { searchParams } = new URL(request.url);
    const onlyNames = searchParams.get("onlyNames");

    let query = `
      SELECT module_id, module_name, module_code, credits
      FROM modules
    `;

    if (onlyNames) {
      query = `SELECT module_name FROM modules ORDER BY module_name ASC`;
    }

    // Fetch modules based on query condition
    const modules = await sql(query);

    return new Response(JSON.stringify({ success: true, data: modules }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/modules GET:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch modules",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
