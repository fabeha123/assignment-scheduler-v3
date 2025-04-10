import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json(
        { success: false, message: "No cookie header found" },
        { status: 401 }
      );
    }

    const tokenCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="));

    if (!tokenCookie) {
      return NextResponse.json(
        { success: false, message: "No token cookie found" },
        { status: 401 }
      );
    }

    const token = tokenCookie.split("=")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is empty" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: missing JWT_SECRET",
        },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      success: true,
      staffId: decoded.userId,
      email: decoded.email,
      full_name: decoded.full_name,
      role: decoded.role,
      role_id: decoded.role_id,
      userType: decoded.userType,
    });
  } catch (error) {
    console.error("Error in user API:", error);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 403 }
    );
  }
}
