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

    let userType = "staff";
    let userIdColumn = "staff_id";
    let tableName = "staff";

    let userQuery = `
      SELECT staff_id FROM staff 
      WHERE activation_token = $1 AND status = 'Pending';
    `;
    let userResult = await sql(userQuery, [token]);

    if (!userResult || userResult.length === 0) {
      userType = "student";
      userIdColumn = "student_id";
      tableName = "students";

      userQuery = `
        SELECT student_id FROM students 
        WHERE activation_token = $1 AND status = 'Pending';
      `;
      userResult = await sql(userQuery, [token]);

      if (!userResult || userResult.length === 0) {
        return new Response(
          JSON.stringify({ message: "Invalid or expired token" }),
          { status: 400 }
        );
      }
    }

    const userId = userResult[0][userIdColumn];

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateQuery = `
      UPDATE ${tableName}
      SET password = $1, status = 'Active', activation_token = NULL
      WHERE ${userIdColumn} = $2;
    `;
    await sql(updateQuery, [hashedPassword, userId]);

    return new Response(
      JSON.stringify({
        message: `Signup completed successfully for ${userType}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup API Error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
