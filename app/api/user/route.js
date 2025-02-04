import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const cookieHeader = request.headers.get("cookie");
  const authToken = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("authToken="))
    ?.split("=")[1];

  if (!authToken) {
    return NextResponse.json(
      { success: false, message: "No token found" },
      { status: 401 }
    );
  }

  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

    return NextResponse.json({
      success: true,
      full_name: decodedToken.full_name,
      role: decodedToken.role,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 403 }
    );
  }
}
