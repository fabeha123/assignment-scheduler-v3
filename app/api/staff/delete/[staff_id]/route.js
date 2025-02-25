import { neon } from "@neondatabase/serverless";

export async function DELETE(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const { pathname } = new URL(request.url);
    const staff_id = pathname.split("/").pop();

    if (!staff_id) {
      return new Response(
        JSON.stringify({ success: false, message: "Staff ID is required" }),
        { status: 400 }
      );
    }

    await sql(`DELETE FROM staff_coursesmodules WHERE staff_id = $1`, [
      staff_id,
    ]);

    const result = await sql(`DELETE FROM staff WHERE staff_id = $1`, [
      staff_id,
    ]);

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Staff not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Staff deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting staff:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
