"use server";

import { cookies } from "next/headers";
import { fetcher } from "@/utils/fetcher";

export interface RefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function refreshTokenAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
      return false;
    }

    const res: RefreshResponse = await fetcher("/auth/refresh/", {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    cookieStore.set("access_token", res.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: res.expires_in,
      sameSite: "strict",
    });

    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return false;
  }
}
