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

    const courseCodes = courses.map((course) => course.value);

    if (courseCodes.some((code) => code.length > 50)) {
      return new Response(
        JSON.stringify({ success: false, message: "Course code too long" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
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
           ON CONFLICT (module_code, course_code) DO UPDATE SET is_core = $3`,
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
    console.error(" Error in /api/modules POST:", error);
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

    // Query params -> change them [ ] format to make it short and nice to understand (next supports [])
    const { searchParams } = new URL(request.url);
    const onlyNames = searchParams.get("onlyNames");
    const coursesParam = searchParams.get("courses"); // New param for course input

    if (onlyNames) {
      const query = `SELECT module_name FROM modules ORDER BY module_name ASC`;
      const modules = await sql(query);
      return new Response(JSON.stringify({ success: true, data: modules }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (coursesParam) {
      let coursesArray;
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
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const placeholders = coursesArray.map((_, i) => `$${i + 1}`).join(", ");

      const modulesByCourseQuery = `
        SELECT m.module_name, m.module_code, cm.course_code, cm.id
        FROM courses_modules cm
        JOIN modules m ON cm.module_code = m.module_code
        WHERE cm.course_code IN (${placeholders})
      `;

      try {
        const modulesList = await sql(modulesByCourseQuery, coursesArray);

        if (!Array.isArray(modulesList) || modulesList.length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "No modules found for the provided courses.",
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const formattedModulesList = modulesList.map(
          ({ module_name, module_code, course_code, id }) => ({
            id,
            name: `${module_name} (${module_code}) - ${course_code}`,
          })
        );

        return new Response(
          JSON.stringify({ success: true, data: formattedModulesList }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (queryError) {
        console.error(" SQL Query Error:", queryError);
        return new Response(
          JSON.stringify({ success: false, message: "Database query failed." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
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

    const modules = await sql(query);

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
