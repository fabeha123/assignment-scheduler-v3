import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`SELECT role_name FROM Roles`;

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
    console.error("Error fetching roles:", error);

    // Return an error response
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch roles",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
