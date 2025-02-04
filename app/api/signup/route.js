import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const { token, password } = await request.json();

    if (!token || !password) {
      return new Response(
        JSON.stringify({ message: "Invalid token or password" }),
        { status: 400 }
      );
    }

    const staffQuery = `
      SELECT staff_id FROM staff 
      WHERE activation_token = $1 AND status = 'Pending';
    `;
    const staffResult = await sql(staffQuery, [token]);

    if (!staffResult || staffResult.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    const staffId = staffResult[0].staff_id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateQuery = `
      UPDATE staff
      SET password = $1, status = 'Active', activation_token = NULL
      WHERE staff_id = $2;
    `;
    await sql(updateQuery, [hashedPassword, staffId]);

    return new Response(
      JSON.stringify({ message: "Signup completed successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
