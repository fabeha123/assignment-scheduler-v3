import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const { fullname, email, password } = await request.json();
    const sql = neon(process.env.DATABASE_URL);

    // Attempt the insertion
    await sql(
      `
      INSERT INTO staff (full_name, email, password)
      VALUES ($1, $2, $3)
      `,
      [fullname, email, password]
    );

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "User created" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/signup:", error);

    // Detect unique constraint violation
    // Postgres often returns error code '23505' for unique violations
    // or the error message might contain "duplicate key value violates unique constraint"
    if (
      error.message.includes("duplicate key value") ||
      error.code === "23505"
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email already exists.",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // else return a generic server error
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
