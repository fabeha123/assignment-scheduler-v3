import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    const userResult = await sql`
      SELECT staff_id, full_name, email, password, role_id, status 
      FROM staff 
      WHERE email = ${email}`;

    if (!userResult || userResult.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const user = userResult[0];

    if (user.status !== "Active") {
      return new Response(
        JSON.stringify({
          message: "Account is not activated. Check your email.",
        }),
        { status: 403 }
      );
    }

    if (!user.password) {
      return new Response(
        JSON.stringify({ message: "You need to set up your password first." }),
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { staffId: user.staff_id, email: user.email, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ message: "Sign-in successful" }), {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
