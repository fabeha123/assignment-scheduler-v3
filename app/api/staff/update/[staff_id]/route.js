import { neon } from "@neondatabase/serverless";

export async function PATCH(request, { params }) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    if (!params || !params.staff_id) {
      return new Response(
        JSON.stringify({ message: "Missing staff_id in URL" }),
        {
          status: 400,
        }
      );
    }

    const staff_id = params.staff_id;
    const requestBody = await request.json();

    console.log("🔹 Received API Request Data:", requestBody); // ✅ Debugging
    console.log("🔹 staff_id:", staff_id);

    const { full_name, email, role, courses, modules } = requestBody;

    if (!full_name || !email || !role) {
      console.error("❌ Missing required fields:", { full_name, email, role });
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // ✅ Proceed with update if fields are correct
    await sql("BEGIN");

    const updateStaffQuery = `
      UPDATE staff
      SET full_name = $1, email = $2, role_id = $3
      WHERE staff_id = $4
      RETURNING staff_id;
    `;
    const staffResult = await sql(updateStaffQuery, [
      full_name,
      email,
      role,
      staff_id,
    ]);

    if (!staffResult || staffResult.length === 0) {
      throw new Error("Failed to update staff record");
    }

    // ✅ Remove old courses & modules
    await sql("DELETE FROM staff_coursesmodules WHERE staff_id = $1", [
      staff_id,
    ]);
    await sql("DELETE FROM staff_courses WHERE staff_id = $1", [staff_id]);

    // ✅ Insert new courses
    if (courses?.length) {
      const placeholders = courses.map((_, i) => `($1, $${i + 2})`).join(", ");
      const params = [staff_id, ...courses];

      await sql(
        `INSERT INTO staff_courses (staff_id, course_code) VALUES ${placeholders}`,
        params
      );
    }

    // ✅ Insert new modules
    if (modules?.length) {
      const placeholders = modules.map((_, i) => `($1, $${i + 2})`).join(", ");
      const params = [staff_id, ...modules];

      await sql(
        `INSERT INTO staff_coursesmodules (staff_id, courses_modules_id) VALUES ${placeholders}`,
        params
      );
    }

    await sql("COMMIT");

    return new Response(
      JSON.stringify({
        message: "Staff updated successfully",
        staffId: staff_id,
      }),
      { status: 200 }
    );
  } catch (error) {
    await sql("ROLLBACK");
    console.error("Error updating staff:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
