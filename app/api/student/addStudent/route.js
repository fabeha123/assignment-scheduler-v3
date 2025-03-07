import { neon } from "@neondatabase/serverless";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { getSignupEmail } from "@/app/utils/emailTemplates/getSignupEmail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { student_id, full_name, email, modules } = await request.json();

    if (!student_id || !full_name || !email) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const activationToken = crypto.randomBytes(32).toString("hex");

    const studentInsertQuery = `
      INSERT INTO students (student_id, full_name, email, password, activation_token, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING student_id;
    `;
    const defaultPassword = null;

    const studentResult = await sql(studentInsertQuery, [
      student_id,
      full_name,
      email,
      defaultPassword,
      activationToken,
      "Pending",
    ]);

    if (!studentResult || studentResult.length === 0) {
      throw new Error("Failed to insert student record");
    }

    if (modules && Array.isArray(modules) && modules.length > 0) {
      const placeholders = modules.map((_, i) => `($1, $${i + 2})`).join(", ");
      const params = [student_id, ...modules];

      await sql(
        `INSERT INTO students_coursesmodules (student_id, courses_modules_id) VALUES ${placeholders}`,
        params
      );
    }

    await sql("COMMIT");

    // console.log(process.env.SENDGRID_API_KEY);

    const signupUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/signup?token=${activationToken}`;

    const emailTemplate = getSignupEmail(full_name, signupUrl);

    const msg = {
      to: email,
      from: "k2110157@kingston.ac.uk",
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("SendGrid Error:", emailError.response?.body || emailError);
    }

    return new Response(
      JSON.stringify({ message: "Student added and email sent", student_id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in addStudent API:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
