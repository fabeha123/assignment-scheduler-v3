import { neon } from "@neondatabase/serverless";
export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const result =
      await sql`SELECT staff.full_name, staff.email, staff.status, roles.role_name FROM staff LEFT JOIN roles ON roles.role_id = staff.role_id`;

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching staff:", error);

    // Return an error response
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch staff",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
