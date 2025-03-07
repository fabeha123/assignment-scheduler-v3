import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { role_name } = await request.json();

    if (!role_name) {
      return new Response(
        JSON.stringify({ success: false, message: "Role name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await sql`
      INSERT INTO Roles (role_name)
      VALUES (${role_name})
      RETURNING role_id, role_name;
    `;

    return new Response(JSON.stringify({ success: true, data: result[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding role:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to add role" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
