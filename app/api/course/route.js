import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    // Parse JSON from the request body
    const { name, start_date, end_date, duration } = await request.json();
    const sql = neon(process.env.DATABASE_URL);

    // Validate input
    if (!name || !start_date || !end_date || !duration) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All fields are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Insert data into the course table
    await sql(
      `
      INSERT INTO course (name, start_date, end_date, duration)
      VALUES ($1, $2, $3, $4)
      `,
      [name, start_date, end_date, duration]
    );

    return new Response(
      JSON.stringify({ success: true, message: "Course added successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/course POST:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Fetch courses from the database
    const courses = await sql(`
      SELECT course_id, name, start_date, end_date, duration
      FROM course
      ORDER BY created_at DESC
    `);

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
