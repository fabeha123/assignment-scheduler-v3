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

    // Extract course codes from input
    const extractedCourseCodes = courses
      .map((course) => course.match(/\((.*?)\)/)?.[1])
      .filter(Boolean);

    if (extractedCourseCodes.length !== courses.length) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid course format." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate extracted course codes
    const placeholders = extractedCourseCodes
      .map((_, i) => `$${i + 1}`)
      .join(", ");
    const courseResult = await sql(
      `SELECT course_code FROM course WHERE course_code IN (${placeholders})`,
      extractedCourseCodes
    );

    if (courseResult.length !== extractedCourseCodes.length) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "One or more course codes are invalid.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Insert into modules
    await sql(
      `INSERT INTO modules (module_code, module_name, credits) VALUES ($1, $2, $3) ON CONFLICT (module_code) DO NOTHING`,
      [module_code, module_name, credits]
    );

    // Insert into courses_modules
    await Promise.all(
      extractedCourseCodes.map(async (course_code) => {
        await sql(
          `INSERT INTO courses_modules (module_code, course_code, is_core) VALUES ($1, $2, $3) ON CONFLICT (module_code, course_code) DO UPDATE SET is_core = $3`,
          [module_code, course_code, is_core]
        );
      })
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

    // Parse query params
    const { searchParams } = new URL(request.url);
    const onlyNames = searchParams.get("onlyNames");

    if (onlyNames) {
      const query = `SELECT module_name FROM modules ORDER BY module_name ASC`;
      const modules = await sql(query);
      return new Response(JSON.stringify({ success: true, data: modules }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const query = `
      SELECT 
        m.module_name, 
        m.module_code, 
        m.credits, 
        CASE WHEN bool_or(cm.is_core) THEN 'Yes' ELSE 'No' END AS is_core,
        JSON_AGG(c.name) AS courses
      FROM modules m
      LEFT JOIN courses_modules cm ON m.module_code = cm.module_code
      LEFT JOIN course c ON cm.course_code = c.course_code
      GROUP BY m.module_name, m.module_code, m.credits
      ORDER BY m.module_name;
    `;

    // Fetch modules with related courses
    const modules = await sql(query);

    // Format courses as comma-separated lists
    const formattedModules = modules.map((module) => ({
      ...module,
      courses: module.courses ? module.courses.join(", ") : "",
    }));

    return new Response(
      JSON.stringify({ success: true, data: formattedModules }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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
