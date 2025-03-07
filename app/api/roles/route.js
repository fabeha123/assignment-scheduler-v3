import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT role_id, role_name FROM Roles`;

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch roles" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

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

    const result = await sql`
      DELETE FROM Roles WHERE role_id = ${role_id} RETURNING role_id;
    `;

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Role not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Role deleted" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting role:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to delete role" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
