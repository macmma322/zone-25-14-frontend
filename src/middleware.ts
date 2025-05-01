// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/_next",
  "/favicon.ico",
];

const ADMIN_PATHS = ["/dashboard"];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_dev_secret"
);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    console.error("JWT verification failed in middleware:", err);
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public files and routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Optional: Role-based protection
  if (ADMIN_PATHS.includes(pathname)) {
    const role = user.role_name as string;
    if (!["Store Chief", "Hype Lead", "Founder"].includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/account", "/messages/:path*", "/orders/:path*"],
};
