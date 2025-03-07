import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(JSON.stringify({ message: "Logout successful" }), {
    status: 200,
    headers: {
      "Set-Cookie":
        "token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict",
      "Content-Type": "application/json",
    },
  });
}
