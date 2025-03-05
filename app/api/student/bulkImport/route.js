import { neon } from "@neondatabase/serverless";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { getSignupEmail } from "@/app/utils/emailTemplates/getSignupEmail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const requestData = await request.json();

    if (!requestData) {
      return new Response(
        JSON.stringify({ success: false, message: "No student data provided" }),
        { status: 400 }
      );
    }

    const studentList = Array.isArray(requestData)
      ? requestData
      : [requestData];
    let emailsSent = new Set();
    let errors = [];

    for (let i = 0; i < studentList.length; i++) {
      const { student_id, full_name, email, courses, modules } = studentList[i];

      console.log("Processing student:", {
        student_id,
        full_name,
        email,
        courses,
        modules,
      });

      if (!student_id || !full_name || !email || !courses || !modules) {
        console.error(`❌ Missing fields at index ${i}:`, {
          student_id,
          full_name,
          email,
          courses,
          modules,
        });

        errors.push({ index: i, message: "Missing required fields" });
        continue;
      }

      let studentId;
      let activationToken = crypto.randomBytes(32).toString("hex");

      const existingStudent = await sql(
        `SELECT student_id, email FROM students WHERE email = $1`,
        [email]
      );

      if (existingStudent.length > 0) {
        studentId = existingStudent[0].student_id;
      } else {
        const insertStudentQuery = `
          INSERT INTO students (student_id, full_name, email, password, activation_token, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING student_id;
        `;

        const studentResult = await sql(insertStudentQuery, [
          student_id,
          full_name,
          email,
          null,
          activationToken,
          "Pending",
        ]);

        if (!studentResult || studentResult.length === 0) {
          errors.push({
            index: i,
            message: `Failed to insert student record for ${email}`,
          });
          continue;
        }

        studentId = studentResult[0].student_id;

        if (!emailsSent.has(email)) {
          emailsSent.add(email);
          const signupUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/signup?token=${activationToken}`;
          const emailTemplate = getSignupEmail(full_name, signupUrl);

          try {
            await sgMail.send({
              to: email,
              from: "k2110157@kingston.ac.uk",
              subject: emailTemplate.subject,
              html: emailTemplate.html,
            });
          } catch (emailError) {
            console.error(`Failed to send email to ${email}:`, emailError);
            errors.push({
              index: i,
              message: `Failed to send activation email to ${email}`,
            });
          }
        }
      }

      const courseCodes = Array.isArray(courses) ? courses : [courses];
      const moduleCodes = Array.isArray(modules) ? modules : [modules];

      for (let j = 0; j < courseCodes.length; j++) {
        for (let k = 0; k < moduleCodes.length; k++) {
          const course_code = courseCodes[j];
          const module_code = moduleCodes[k];

          const courseModuleResult = await sql(
            `SELECT id FROM courses_modules WHERE course_code = $1 AND module_code = $2`,
            [course_code, module_code]
          );

          if (courseModuleResult.length > 0) {
            const courses_modules_id = courseModuleResult[0].id;

            const existingMapping = await sql(
              `SELECT 1 FROM students_coursesmodules WHERE student_id = $1 AND courses_modules_id = $2`,
              [studentId, courses_modules_id]
            );

            if (existingMapping.length === 0) {
              await sql(
                `INSERT INTO students_coursesmodules (student_id, courses_modules_id)
                 VALUES ($1, $2)`,
                [studentId, courses_modules_id]
              );
            }
          } else {
            errors.push({
              index: i,
              message: `Course-Module pair not found: Course (${course_code}) - Module (${module_code})`,
            });
          }
        }
      }
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bulk students import successful!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
