import { neon } from "@neondatabase/serverless";

export async function DELETE(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Extract module_code from URL
    const { pathname } = new URL(request.url);
    const module_code = pathname.split("/").pop();

    if (!module_code) {
      return new Response(
        JSON.stringify({ success: false, message: "Module code is required" }),
        { status: 400 }
      );
    }

    // Step 1: Delete assignments linked to this module_code
    await sql(`DELETE FROM assignments WHERE module_code = $1`, [module_code]);

    // Step 2: Get all `courses_modules.id` linked to the module_code
    const coursesModulesResult = await sql(
      `SELECT id FROM courses_modules WHERE module_code = $1`,
      [module_code]
    );

    const coursesModulesIds = coursesModulesResult.map((row) => row.id);

    if (coursesModulesIds.length > 0) {
      // Step 3: Delete records from `staff_coursesmodules` linked to courses_modules
      await sql(
        `DELETE FROM staff_coursesmodules WHERE courses_modules_id = ANY($1)`,
        [coursesModulesIds]
      );

      // Step 4: Delete from `courses_modules`
      await sql(`DELETE FROM courses_modules WHERE id = ANY($1)`, [
        coursesModulesIds,
      ]);
    }

    // Step 5: Delete the module from `modules`
    const moduleDeleteResult = await sql(
      `DELETE FROM modules WHERE module_code = $1`,
      [module_code]
    );

    // Step 6: Check if the module was deleted
    if (moduleDeleteResult.rowCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Module not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Module deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting module:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
