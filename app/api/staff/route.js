import { neon } from "@neondatabase/serverless";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { full_name, email, role, modules } = await request.json();

    if (!full_name || !email || !role) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const activationToken = crypto.randomBytes(32).toString("hex");

    const staffInsertQuery = `
      INSERT INTO staff (full_name, email, role_id, password, activation_token, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING staff_id;
    `;
    const defaultPassword = null;

    const staffResult = await sql(staffInsertQuery, [
      full_name,
      email,
      role,
      defaultPassword,
      activationToken,
      "Pending",
    ]);

    if (!staffResult || staffResult.length === 0) {
      throw new Error("Failed to insert staff record");
    }
    const staffId = staffResult[0].staff_id;

    if (modules && Array.isArray(modules) && modules.length > 0) {
      const placeholders = modules.map((_, i) => `($1, $${i + 2})`).join(", ");
      const params = [staffId, ...modules];

      await sql(
        `INSERT INTO staff_coursesmodules (staff_id, courses_modules_id) VALUES ${placeholders}`,
        params
      );
    }

    await sql("COMMIT");

    const signupUrl = `${process.env.FRONTEND_URL}/signup?token=${activationToken}`;
    console.log("Generated Signup URL:", signupUrl);

    const msg = {
      to: email,
      from: "k2110157@kingston.ac.uk",
      subject: "Complete Your Signup",
      html: `<p>Hi ${full_name},</p>
             <p>Welcome! Click the link below to complete your signup:</p>
             <p><a href="${signupUrl}">Complete Signup</a></p>
             <p>If you didn’t request this, please ignore this email.</p>`,
    };

    await sgMail.send(msg);

    return new Response(
      JSON.stringify({ message: "Staff added and email sent", staffId }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT staff.full_name, staff.email, staff.status, roles.role_name 
      FROM staff 
      LEFT JOIN roles ON roles.role_id = staff.role_id`;

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
