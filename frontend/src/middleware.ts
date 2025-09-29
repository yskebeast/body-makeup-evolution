import { NextResponse, type NextRequest } from "next/server";
import { AUTH_PATH_PREFIX, UNAUTHORIZED_REDIRECT_PATHS } from "../const/auth";
import { fetcher } from "./utils/fetcher";
import { RefreshApiResponse } from "./schemas/refreshApi";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith(AUTH_PATH_PREFIX);

  if (!accessToken && refreshToken) {
    try {
      const res: RefreshApiResponse = await fetcher("/auth/refresh/", {
        method: "POST",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });

      const response = NextResponse.next();
      response.cookies.set("access_token", res.access_token, {
        httpOnly: true,
        secure: true,
        maxAge: res.expires_in,
        sameSite: "strict",
      });
      return response;
    } catch (error) {
      console.error("Token refresh in middleware failed:", error);
      const response = NextResponse.next();
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  if (accessToken && refreshToken && isAuthPage) {
    const profileUrl = new URL("/profile", request.nextUrl.origin);
    return NextResponse.redirect(profileUrl);
  }

  if (!accessToken && !refreshToken && UNAUTHORIZED_REDIRECT_PATHS.includes(pathname)) {
    const loginUrl = new URL("/auth/login", request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
