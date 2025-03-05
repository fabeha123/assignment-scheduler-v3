import { neon } from "@neondatabase/serverless";

export async function PATCH(request, context) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    const params = await context.params;

    if (!params || !params.student_id) {
      return new Response(
        JSON.stringify({ message: "Missing student_id in URL" }),
        { status: 400 }
      );
    }

    const student_id = params.student_id;
    const requestBody = await request.json();
    const { full_name, email, modules } = requestBody;

    if (!full_name || !email || !modules) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    await sql("BEGIN");

    const existingStudent = await sql(
      `SELECT full_name, email FROM students WHERE student_id = $1`,
      [student_id]
    );

    if (!existingStudent || existingStudent.length === 0) {
      throw new Error("Student record not found");
    }

    const { full_name: existingName, email: existingEmail } =
      existingStudent[0];

    if (full_name !== existingName || email !== existingEmail) {
      const updateStudentQuery = `
        UPDATE students
        SET full_name = $1, email = $2
        WHERE student_id = $3;
      `;
      await sql(updateStudentQuery, [full_name, email, student_id]);
    }

    await sql("DELETE FROM students_coursesmodules WHERE student_id = $1", [
      student_id,
    ]);

    if (modules?.length) {
      const insertModuleValues = modules
        .map((_, i) => `($1, $${i + 2})`)
        .join(", ");
      const moduleParams = [student_id, ...modules];

      await sql(
        `INSERT INTO students_coursesmodules (student_id, courses_modules_id) VALUES ${insertModuleValues}`,
        moduleParams
      );
    }

    await sql("COMMIT");

    return new Response(
      JSON.stringify({
        message: "Student update processed successfully",
        studentId: student_id,
      }),
      { status: 200 }
    );
  } catch (error) {
    await sql("ROLLBACK").catch(() => {});
    console.error("Error updating student:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
