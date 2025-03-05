import { neon } from "@neondatabase/serverless";

export async function DELETE(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const { pathname } = new URL(request.url);
    const student_id = pathname.split("/").pop();

    if (!student_id) {
      return new Response(
        JSON.stringify({ success: false, message: "Student ID is required" }),
        { status: 400 }
      );
    }

    await sql(`DELETE FROM students_coursesmodules WHERE student_id = $1`, [
      student_id,
    ]);

    const result = await sql(`DELETE FROM students WHERE student_id = $1`, [
      student_id,
    ]);

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Student not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Student deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
