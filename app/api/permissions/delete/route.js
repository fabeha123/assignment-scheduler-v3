import { neon } from "@neondatabase/serverless";

export async function DELETE(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { role_id } = await request.json();

    if (!role_id) {
      return new Response(
        JSON.stringify({ success: false, message: "Role ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const roleInUse = await sql`
      SELECT COUNT(*) AS count FROM staff WHERE role_id = ${role_id};
    `;

    if (parseInt(roleInUse[0].count) > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Role in use, cannot delete",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await sql`
      DELETE FROM permissions WHERE role_id = ${role_id};
    `;

    const deleteRole = await sql`
      DELETE FROM Roles WHERE role_id = ${role_id} RETURNING role_id;
    `;

    if (deleteRole.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Role not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Role and permissions deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting role and permissions:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to delete role" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
