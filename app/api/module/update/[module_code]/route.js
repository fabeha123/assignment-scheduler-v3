import { neon } from "@neondatabase/serverless";

export async function PATCH(request) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/");
    const module_code = segments[segments.length - 1]; // e.g., "PR_003"

    const requestBody = await request.json();
    const { module_name, is_core, credits, courses } = requestBody;

    if (
      !module_code ||
      !module_name ||
      credits == null ||
      !Array.isArray(courses)
    ) {
      return new Response(
        JSON.stringify({ message: "Missing or invalid fields" }),
        { status: 400 }
      );
    }

    const courseCodes = courses.map((course) => course.value); // Extract course_code

    console.log("Extracted Course Codes:", courseCodes);

    await sql("BEGIN");

    const existingModule = await sql(
      `SELECT module_name, credits FROM modules WHERE module_code = $1`,
      [module_code]
    );
    if (!existingModule || existingModule.length === 0) {
      throw new Error("Module not found");
    }

    const { module_name: existingName, credits: existingCredits } =
      existingModule[0];

    if (
      module_name !== existingName ||
      String(credits) !== String(existingCredits)
    ) {
      await sql(
        `UPDATE modules SET module_name = $1, credits = $2 WHERE module_code = $3`,
        [module_name, credits, module_code]
      );
    }

    const existingCombos = await sql(
      `SELECT course_code FROM courses_modules WHERE module_code = $1`,
      [module_code]
    );
    const existingCourseCodes = existingCombos.map((row) => row.course_code);

    for (const courseCode of courseCodes) {
      if (existingCourseCodes.includes(courseCode)) {
        await sql(
          `UPDATE courses_modules SET is_core = $1 WHERE module_code = $2 AND course_code = $3`,
          [is_core, module_code, courseCode]
        );
      } else {
        await sql(
          `INSERT INTO courses_modules (module_code, course_code, is_core)
           VALUES ($1, $2, $3)`,
          [module_code, courseCode, is_core]
        );
      }
    }

    const newCourseSet = new Set(courseCodes);
    for (const oldCourseCode of existingCourseCodes) {
      if (!newCourseSet.has(oldCourseCode)) {
        try {
          await sql(
            `DELETE FROM courses_modules WHERE module_code = $1 AND course_code = $2`,
            [module_code, oldCourseCode]
          );
        } catch (error) {
          if (error.code === "23503") {
            throw new Error(
              "Cannot remove course from module because it is linked to a staff member. Unassign the staff member first."
            );
          } else {
            throw error;
          }
        }
      }
    }

    await sql("COMMIT");

    return new Response(
      JSON.stringify({ message: "Module updated successfully", module_code }),
      { status: 200 }
    );
  } catch (error) {
    await sql("ROLLBACK").catch(() => {});

    return new Response(
      JSON.stringify({ message: error.message || "Server error" }),
      { status: 400 }
    );
  }
}
