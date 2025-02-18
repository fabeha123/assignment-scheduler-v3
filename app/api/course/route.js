import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const body = await request.json();

    // Check if body is an array (Bulk Insert)
    if (Array.isArray(body)) {
      // Validate input
      for (const course of body) {
        const { name, course_code, start_date, end_date, duration } = course;
        if (!name || !course_code || !start_date || !end_date || !duration) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "All fields are required in each course.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      // bulk insert query
      const values = body
        .map(
          (_, i) =>
            `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${
              i * 5 + 5
            })`
        )
        .join(", ");

      const query = `
        INSERT INTO course (name, course_code, start_date, end_date, duration)
        VALUES ${values}
      `;

      const params = body.flatMap(
        ({ name, course_code, start_date, end_date, duration }) => [
          name,
          course_code,
          start_date,
          end_date,
          duration,
        ]
      );

      await sql(query, params);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Courses imported successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Single Course Insert
    const { name, course_code, start_date, end_date, duration } = body;

    if (!name || !course_code || !start_date || !end_date || !duration) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await sql(
      `
      INSERT INTO course (name, course_code, start_date, end_date, duration)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [name, course_code, start_date, end_date, duration]
    );

    return new Response(
      JSON.stringify({ success: true, message: "Course added successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in /api/course POST:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Parse query params to check if 'onlyNames' is requested
    const { searchParams } = new URL(request.url);
    const onlyNames = searchParams.get("onlyNames");

    let query = `
      SELECT course_code, name, course_code, start_date, end_date, duration
      FROM course
      ORDER BY created_at DESC
    `;

    if (onlyNames) {
      query = `SELECT name, course_code FROM course ORDER BY created_at DESC`;
    }

    // Fetch courses based on query condition
    const courses = await sql(query);

    return new Response(JSON.stringify({ success: true, data: courses }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/course GET:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch courses",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
