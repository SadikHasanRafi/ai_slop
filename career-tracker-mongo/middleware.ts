import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/token";

// Signed-out visitors go to /login; signed-in visitors skip it.
export async function middleware(request: NextRequest) {
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const onLogin = request.nextUrl.pathname.startsWith("/login");

  if (!session && !onLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (session && onLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
