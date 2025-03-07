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

    const userId = payload.userId;
    const hasAllUsersPermission = payload.hasAllUsersPermission || false;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("X-User-Id", userId);
    requestHeaders.set("X-All-Users", hasAllUsersPermission.toString());

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
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
    "/permissions/:path*",
    "/api/course/:path*",
    "/api/assignments/:path*",
    "/api/module/:path*",
    "/api/permissions/:path*",
    "/api/roles/:path*",
    "/api/staff/:path*",
    "/api/student/:path*",
  ],
};
