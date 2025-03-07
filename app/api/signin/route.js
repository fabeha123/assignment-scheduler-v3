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

    let userType = "staff";
    let userIdColumn = "staff_id";
    let tableName = "staff";
    let role = null;

    let userQuery = `
      SELECT staff_id AS user_id, full_name, email, password, role_id, status 
      FROM staff 
      WHERE email = $1
    `;
    let userResult = await sql(userQuery, [email]);

    if (!userResult || userResult.length === 0) {
      userType = "student";
      userIdColumn = "student_id";
      tableName = "students";

      userQuery = `
        SELECT student_id AS user_id, full_name, email, password, status 
        FROM students 
        WHERE email = $1
      `;
      userResult = await sql(userQuery, [email]);

      if (!userResult || userResult.length === 0) {
        return new Response(
          JSON.stringify({ message: "Invalid email or password" }),
          { status: 401 }
        );
      }
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

    if (userType === "staff") {
      const roleResult = await sql`
        SELECT role_name 
        FROM roles 
        WHERE role_id = ${user.role_id}
      `;

      if (!roleResult || roleResult.length === 0) {
        return new Response(
          JSON.stringify({ message: "User role not found" }),
          { status: 500 }
        );
      }
      role = roleResult[0].role_name;
    } else {
      role = "student";
    }

    const allUsersQuery = `
      SELECT all_users
      FROM permissions 
      WHERE role_id = $1 
      AND tab_name = 'all_users'
    `;

    const allUsersResult = await sql(allUsersQuery, [user.role_id]);

    const hasAllUsersPermission =
      allUsersResult.length > 0 && Boolean(allUsersResult[0].all_users);

    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: role,
        role_id: user.role_id,
        userType: userType,
        hasAllUsersPermission,
      },
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
    console.error("Error during sign-in:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
