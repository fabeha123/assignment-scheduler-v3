import { neon } from "@neondatabase/serverless";

export async function DELETE(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // extract assignment_id from URL
    const { pathname } = new URL(request.url);
    const assignment_id = pathname.split("/").pop();

    if (!assignment_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Assignment ID is required",
        }),
        { status: 400 }
      );
    }

    // Step 1: Delete the assignment from `assignments` table
    const deleteResult = await sql(
      `DELETE FROM assignments WHERE assignment_id = $1`,
      [assignment_id]
    );

    // Step 2: Check if the assignment was deleted
    if (deleteResult.rowCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Assignment not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Assignment deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting assignment:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
