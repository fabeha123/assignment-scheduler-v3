import { neon } from "@neondatabase/serverless";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);

    if (!resolvedParams || !resolvedParams.token) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing token" }),
        { status: 400 }
      );
    }

    const token = resolvedParams.token;

    const sql = neon(process.env.DATABASE_URL);

    const studentResult = await sql`
      SELECT full_name, email FROM students 
      WHERE activation_token = ${token} AND status = 'Pending';
    `;

    if (!studentResult || studentResult.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, ...studentResult[0] }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in student token verification API:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
