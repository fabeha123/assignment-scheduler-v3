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

    const staffResult = await sql`
      SELECT full_name, email FROM staff 
      WHERE activation_token = ${token} AND status = 'Pending';
    `;

    if (!staffResult || staffResult.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ success: true, ...staffResult[0] }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
