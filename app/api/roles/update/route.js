import { neon } from "@neondatabase/serverless";

export async function PATCH(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { role_id, role_name } = await request.json();

    if (!role_id || !role_name) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Role ID and name are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const roleCheck = await sql`
      SELECT DISTINCT role_id FROM permissions WHERE role_id = ${role_id};
    `;

    if (roleCheck.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Role not found in permissions table",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await sql`
      UPDATE Roles 
      SET role_name = ${role_name}
      WHERE role_id = ${role_id}
      RETURNING role_id, role_name;
    `;

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Role update failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, data: result[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to update role" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
