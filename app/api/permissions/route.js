import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT role_id, tab_name, can_read, can_write, no_access, all_users 
      FROM permissions
    `;

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch permissions",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { role_id, tab_name, can_read, can_write, no_access, all_users } =
      await request.json();

    const result = await sql`
      INSERT INTO permissions (role_id, tab_name, can_read, can_write, no_access, all_users)
      VALUES (${role_id}, ${tab_name}, ${can_read}, ${can_write}, ${no_access}, ${all_users})
      ON CONFLICT (role_id, tab_name)
      DO UPDATE SET 
        can_read = EXCLUDED.can_read, 
        can_write = EXCLUDED.can_write, 
        no_access = EXCLUDED.no_access, 
        all_users = EXCLUDED.all_users
      RETURNING *;
    `;

    return new Response(JSON.stringify({ success: true, data: result[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating permission:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to update permission",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
