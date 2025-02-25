import { neon } from "@neondatabase/serverless";

export async function DELETE(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Extract course_code from URL
    const { pathname } = new URL(request.url);
    const course_code = pathname.split("/").pop();

    if (!course_code) {
      return new Response(
        JSON.stringify({ success: false, message: "Course code is required" }),
        { status: 400 }
      );
    }

    // Step 1: Get all `courses_modules.id` linked to the course_code
    const coursesModulesResult = await sql(
      `SELECT id FROM courses_modules WHERE course_code = $1`,
      [course_code]
    );

    const coursesModulesIds = coursesModulesResult.map((row) => row.id);

    if (coursesModulesIds.length > 0) {
      // Step 2: Delete records from `staff_coursesmodules` linked to courses_modules
      await sql(`DELETE FROM staff_coursesmodules WHERE id = ANY($1)`, [
        coursesModulesIds,
      ]);

      // Step 4: Delete from `courses_modules`
      await sql(`DELETE FROM courses_modules WHERE id = ANY($1)`, [
        coursesModulesIds,
      ]);
    }

    // Step 5: Delete the course from `courses`
    const courseDeleteResult = await sql(
      `DELETE FROM course WHERE course_code = $1`,
      [course_code]
    );

    // Step 6: Check if the course was deleted
    if (courseDeleteResult.rowCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Course not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Course deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
