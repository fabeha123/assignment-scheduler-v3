import { neon } from "@neondatabase/serverless";

export async function PATCH(request, { params }) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (!params || !params.staff_id) {
      return new Response(
        JSON.stringify({ message: "Missing staff_id in URL" }),
        { status: 400 }
      );
    }

    const staff_id = params.staff_id;
    const requestBody = await request.json();
    const { full_name, email, role, modules } = requestBody;

    if (!full_name || !email || !role) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    await sql("BEGIN");

    const existingStaff = await sql(
      `SELECT full_name, email, role_id FROM staff WHERE staff_id = $1`,
      [staff_id]
    );

    if (!existingStaff || existingStaff.length === 0) {
      throw new Error("Staff record not found");
    }

    const {
      full_name: existingName,
      email: existingEmail,
      role_id: existingRole,
    } = existingStaff[0];

    if (
      full_name !== existingName ||
      email !== existingEmail ||
      role !== existingRole
    ) {
      const updateStaffQuery = `
        UPDATE staff
        SET full_name = $1, email = $2, role_id = $3
        WHERE staff_id = $4;
      `;
      await sql(updateStaffQuery, [full_name, email, role, staff_id]);
    }

    // Remove old `staff_coursesmodules` records
    await sql("DELETE FROM staff_coursesmodules WHERE staff_id = $1", [
      staff_id,
    ]);

    // Insert new modules into `staff_coursesmodules`
    if (modules?.length) {
      const insertModuleValues = modules
        .map((_, i) => `($1, $${i + 2})`)
        .join(", ");
      const moduleParams = [staff_id, ...modules];

      await sql(
        `INSERT INTO staff_coursesmodules (staff_id, courses_modules_id) VALUES ${insertModuleValues}`,
        moduleParams
      );
    }

    await sql("COMMIT");

    return new Response(
      JSON.stringify({
        message: "Staff update processed successfully",
        staffId: staff_id,
      }),
      { status: 200 }
    );
  } catch (error) {
    await sql("ROLLBACK").catch(() => {});
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
