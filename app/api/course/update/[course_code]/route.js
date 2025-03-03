import { neon } from "@neondatabase/serverless";

export async function PATCH(request, context) {
  const { params } = context;
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (!params || !params.course_code) {
      return new Response(
        JSON.stringify({ message: "Missing course_code in URL" }),
        { status: 400 }
      );
    }

    const course_code = params.course_code;
    const requestBody = await request.json();
    const { name, start_date, end_date, duration } = requestBody;

    if (!name || !start_date || !end_date || !duration) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Check if course exists
    const existingCourse = await sql`
      SELECT name, start_date, end_date, duration 
      FROM course 
      WHERE course_code = ${course_code};
    `;

    if (existingCourse.length === 0) {
      return new Response(
        JSON.stringify({ message: "Course record not found" }),
        { status: 404 }
      );
    }

    const {
      name: existingName,
      start_date: existingStartDate,
      end_date: existingEndDate,
      duration: existingDuration,
    } = existingCourse[0];

    if (
      name !== existingName ||
      start_date !== existingStartDate ||
      end_date !== existingEndDate ||
      duration !== existingDuration
    ) {
      await sql`
        UPDATE course
        SET name = ${name}, start_date = ${start_date}, end_date = ${end_date}, duration = ${duration}
        WHERE course_code = ${course_code};
      `;
    }

    return new Response(
      JSON.stringify({ message: "Course updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
