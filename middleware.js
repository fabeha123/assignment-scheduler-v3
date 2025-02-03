import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const authToken = request.cookies.get("token")?.value;

  if (
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  if (!authToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(authToken, secretKey);

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/staff/:path*",
    "/courses/:path*",
    "/modules/:path*",
    "/assignments/:path*",
  ],
};
