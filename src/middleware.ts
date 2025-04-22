import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "./app/lib/session";
// import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlewares/api/authMiddleware";

/** Middleware configuration */
export const config = {
  matcher: ["/api/:path*"],
};

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
// const publicRoutes = ["/login"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  // // Allow public routes without checking JWT
  // if (req.nextUrl.pathname.startsWith("/api/users")) {
  //   return NextResponse.next();
  // }

  // Allow public routes without checking JWT
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  // const isProtectedRoute = protectedRoutes.includes(path);
  // const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  // const cookieStore = await cookies(); // ✅ Await cookies()
  // const cookie = cookieStore.get("session")?.value;
  // const session = await decrypt(cookie);

  // const token = req.cookies.get("session")?.value;
  // if (!token) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const authResult = authMiddleware(req);
  if (!authResult?.isValid) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  return NextResponse.next();
  // try {
  //   jwt.verify(token, SECRET_KEY);
  //   return NextResponse.next();
  // } catch (error) {
  //   return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  // }

  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  // ////4. Redirect
  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL("/", req.nextUrl));
  // }

  // if (
  //   isPublicRoute &&
  //   token &&
  //   !req.nextUrl.pathname.startsWith("/dashboard")
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  // }

  // if (isProtectedRoute && !session?.userId) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  // ////4. Redirect
  // if (isProtectedRoute && !session?.userId) {
  //   return NextResponse.redirect(new URL("/", req.nextUrl));
  // }

  // if (
  //   isPublicRoute &&
  //   session?.userId &&
  //   !req.nextUrl.pathname.startsWith("/dashboard")
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  // }
}
