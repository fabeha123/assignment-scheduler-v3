import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const role_id = searchParams.get("role_id");

    if (!role_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "role_id is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await sql`
      SELECT role_id, tab_name, can_read, can_write, no_access, all_users 
      FROM permissions WHERE role_id = ${role_id};
    `;

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching permissions by role:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch permissions for the role",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
