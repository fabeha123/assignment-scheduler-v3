import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  // Debug: Log the raw cookie header
  const cookieHeader = request.headers.get("cookie");
  console.log("[DEBUG] Cookie header:", cookieHeader);

  // Debug: Extract and log the auth token from the cookies
  const authToken = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("authToken="))
    ?.split("=")[1];

  console.log("[DEBUG] Extracted authToken:", authToken);

  if (!authToken) {
    console.log("[DEBUG] No authToken found in the cookie header.");
    return NextResponse.json(
      { success: false, message: "No token found" },
      { status: 401 }
    );
  }

  // Debug: Check if the JWT_SECRET is available (do not log the actual secret)
  console.log("[DEBUG] JWT_SECRET is set:", !!process.env.JWT_SECRET);

  try {
    // Debug: Attempt to verify the token using the JWT_SECRET
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log("[DEBUG] Token successfully decoded:", decodedToken);

    return NextResponse.json({
      success: true,
      full_name: decodedToken.full_name,
      role: decodedToken.role,
    });
  } catch (error) {
    console.error("[DEBUG] Error verifying token:", error);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 403 }
    );
  }
}
