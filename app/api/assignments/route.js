import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const {
      name,
      weightage,
      module,
      startDate,
      endDate,
      objectives = [],
      brief,
      markingCriteria = [],
    } = await request.json();

    const sql = neon(process.env.DATABASE_URL);

    // Validate required fields
    if (!name || !module || !startDate || !endDate || !brief) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Name, module, startDate, endDate, and brief are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch the module_id using the module name
    const moduleResult = await sql(
      `SELECT module_id FROM modules WHERE module_name = $1`,
      [module]
    );

    if (moduleResult.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid module name. No matching module found.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const moduleId = moduleResult[0].module_id;

    // Insert assignment into the assignments table
    const assignmentResult = await sql(
      `
      INSERT INTO assignments (name, weightage, module_id, start_date, end_date, brief)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING assignment_id
      `,
      [name, weightage, moduleId, startDate, endDate, brief]
    );

    const assignmentId = assignmentResult[0].assignment_id;

    // Insert objectives into the assignment_objectives table
    if (objectives.length > 0) {
      const objectivesValues = objectives
        .map((_, index) => `($${index + 1}, ${assignmentId})`)
        .join(", ");
      await sql(
        `
        INSERT INTO assignment_objectives (objective, assignment_id)
        VALUES ${objectivesValues}
        `,
        objectives
      );
    }

    // Insert marking criteria into the assignment_marking_criteria table
    if (markingCriteria.length > 0) {
      const criteriaValues = markingCriteria
        .map(
          (_, index) =>
            `($${index * 2 + 1}, $${index * 2 + 2}, ${assignmentId})`
        )
        .join(", ");

      const criteriaParams = markingCriteria.flatMap((c) => [
        c.criteria,
        c.weightage,
      ]);

      await sql(
        `
        INSERT INTO assignment_marking_criteria (criteria, weightage, assignment_id)
        VALUES ${criteriaValues}
        `,
        criteriaParams
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Assignment added successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/assignments POST:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const onlyRelated = searchParams.get("onlyRelated");
    const onlyScheduleCheck = searchParams.get("onlyScheduleCheck");
    const moduleName = searchParams.get("module");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let assignments = [];

    if (onlyRelated && moduleName && startDate && endDate) {
      // Fetch assignments within a one-month range (Calendar Use Case)
      const startDateBefore = new Date(startDate);
      startDateBefore.setMonth(startDateBefore.getMonth() - 1);

      const endDateAfter = new Date(endDate);
      endDateAfter.setMonth(endDateAfter.getMonth() + 1);

      const formattedStart = startDateBefore.toISOString().split("T")[0];
      const formattedEnd = endDateAfter.toISOString().split("T")[0];

      // Fetch module ID
      const moduleResult = await sql(
        `SELECT module_id FROM modules WHERE module_name = $1`,
        [moduleName]
      );

      if (moduleResult.length === 0) {
        return new Response(
          JSON.stringify({ success: false, message: "Module not found." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      const moduleId = moduleResult[0].module_id;

      // Fetch all courses linked to the module
      const courseResult = await sql(
        `SELECT course_id FROM courses_modules WHERE module_id = $1`,
        [moduleId]
      );

      if (courseResult.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "No courses found for this module.",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      const courseIds = courseResult.map((c) => c.course_id);

      // Fetch all modules in the same courses
      const relatedModulesResult = await sql(
        `SELECT module_id FROM courses_modules WHERE course_id = ANY($1)`,
        [courseIds]
      );

      const relatedModuleIds = relatedModulesResult.map((m) => m.module_id);

      // Fetch assignments within 1 month range
      assignments = await sql(
        `
        SELECT a.assignment_id, a.name AS assignment_name, a.start_date, a.end_date, m.module_name
        FROM assignments a
        LEFT JOIN modules m ON a.module_id = m.module_id
        WHERE a.module_id = ANY($1)
        AND (
          (a.start_date >= $2 AND a.start_date <= $3)
          AND (a.end_date >= $2 AND a.end_date <= $3)
        )
        ORDER BY a.start_date ASC
        `,
        [relatedModuleIds, formattedStart, formattedEnd]
      );
    } else if (onlyScheduleCheck && moduleName) {
      // Fetch all assignments in related courses/modules (AI Scheduling use case)
      const moduleResult = await sql(
        `SELECT module_id FROM modules WHERE module_name = $1`,
        [moduleName]
      );

      if (moduleResult.length === 0) {
        return new Response(
          JSON.stringify({ success: false, message: "Module not found." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      const moduleId = moduleResult[0].module_id;

      // Fetch all courses linked to the module
      const courseResult = await sql(
        `SELECT course_id FROM courses_modules WHERE module_id = $1`,
        [moduleId]
      );

      if (courseResult.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "No courses found for this module.",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      const courseIds = courseResult.map((c) => c.course_id);

      // Fetch all modules in the same courses
      const relatedModulesResult = await sql(
        `SELECT module_id FROM courses_modules WHERE course_id = ANY($1)`,
        [courseIds]
      );

      const relatedModuleIds = relatedModulesResult.map((m) => m.module_id);

      // Fetch ALL assignments for these modules (no date restriction)
      assignments = await sql(
        `
        SELECT a.assignment_id, a.name AS assignment_name, a.start_date, a.end_date, m.module_name
        FROM assignments a
        LEFT JOIN modules m ON a.module_id = m.module_id
        WHERE a.module_id = ANY($1)
        ORDER BY a.start_date ASC
        `,
        [relatedModuleIds]
      );
    } else {
      // Default query: Fetch all assignments
      assignments = await sql(`
        SELECT a.assignment_id, a.name AS assignment_name, a.weightage, a.start_date, a.end_date, m.module_name
        FROM assignments a
        LEFT JOIN modules m ON a.module_id = m.module_id
        ORDER BY a.start_date ASC
      `);
    }

    return new Response(JSON.stringify({ success: true, data: assignments }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/assignments GET:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch assignments",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
