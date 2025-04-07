// app/api/assignments/add/route.js
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST(request) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    const {
      title,
      summary: brief,
      startDate,
      endDate,
      courseId,
      moduleId, // course_modules_id
      learningOutcomes = [],
      markingCriteria = [],
    } = await request.json();

    // Get module_code from course_modules
    const moduleResult = await sql(
      `SELECT module_code FROM courses_modules WHERE id = $1`,
      [moduleId]
    );

    if (moduleResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Module not found." },
        { status: 400 }
      );
    }

    const moduleCode = moduleResult[0].module_code;

    // Insert into assignments
    const insertAssignment = await sql(
      `
        INSERT INTO assignments (name, brief, start_date, end_date, module_code)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING assignment_id
      `,
      [title, brief, startDate, endDate, moduleCode]
    );

    const assignmentId = insertAssignment[0].assignment_id;

    // Insert objectives
    if (learningOutcomes.length > 0) {
      const values = learningOutcomes
        .map((_, i) => `($${i + 1}, ${assignmentId})`)
        .join(", ");
      await sql(
        `INSERT INTO assignment_objectives (objective, assignment_id) VALUES ${values}`,
        learningOutcomes
      );
    }

    // Insert marking criteria
    if (markingCriteria.length > 0) {
      const valueTuples = markingCriteria
        .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2}, ${assignmentId})`)
        .join(", ");
      const params = markingCriteria.flatMap((c) => [c.criteria, c.weightage]);
      await sql(
        `INSERT INTO assignment_marking_criteria (criteria, weightage, assignment_id) VALUES ${valueTuples}`,
        params
      );
    }

    return NextResponse.json({ success: true, assignmentId }, { status: 200 });
  } catch (err) {
    console.error("Error saving assignment:", err);
    return NextResponse.json(
      { success: false, message: "Failed to save assignment." },
      { status: 500 }
    );
  }
}
