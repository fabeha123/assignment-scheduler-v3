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
        JSON.stringify({ success: false, message: "No staff data provided" }),
        { status: 400 }
      );
    }

    const staffList = Array.isArray(requestData) ? requestData : [requestData];
    let emailsSent = new Set();
    let fileProcessedEmails = new Map();
    const errors = [];

    for (let i = 0; i < staffList.length; i++) {
      const { name: full_name, email, role, courses, modules } = staffList[i];

      if (!full_name || !email || !role || !courses || !modules) {
        errors.push({ index: i, message: "Missing required fields" });
        continue;
      }

      let staffId;
      let activationToken;

      const existingStaff = await sql(
        `SELECT staff_id, email FROM staff WHERE email = $1`,
        [email]
      );

      if (existingStaff.length > 0) {
        staffId = existingStaff[0].staff_id;
      } else {
        const roleResult = await sql(
          `SELECT role_id FROM roles WHERE role_name = $1`,
          [role]
        );

        if (!roleResult || roleResult.length === 0) {
          errors.push({ index: i, message: `Invalid role name: ${role}` });
          continue;
        }

        let roleId = roleResult[0].role_id;
        activationToken = crypto.randomBytes(32).toString("hex");

        const insertStaffQuery = `
          INSERT INTO staff (full_name, email, role_id, password, activation_token, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING staff_id;
        `;

        const staffResult = await sql(insertStaffQuery, [
          full_name,
          email,
          roleId,
          null,
          activationToken,
          "Pending",
        ]);

        if (!staffResult || staffResult.length === 0) {
          errors.push({
            index: i,
            message: `Failed to insert staff record for ${email}`,
          });
          continue;
        }

        staffId = staffResult[0].staff_id;

        if (!emailsSent.has(email)) {
          emailsSent.add(email);
          const signupUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/signup?token=${activationToken}`;
          const emailTemplate = getSignupEmail(full_name, signupUrl);

          await sgMail.send({
            to: email,
            from: "k2110157@kingston.ac.uk",
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          });
        }
      }

      const courseCodes = courses.map(String);
      const moduleCodes = modules.map(String);

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
              `SELECT 1 FROM staff_coursesmodules WHERE staff_id = $1 AND courses_modules_id = $2`,
              [staffId, courses_modules_id]
            );

            if (existingMapping.length === 0) {
              await sql(
                `INSERT INTO staff_coursesmodules (staff_id, courses_modules_id)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`,
                [staffId, courses_modules_id]
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
        message: "Bulk staff import successful!",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
