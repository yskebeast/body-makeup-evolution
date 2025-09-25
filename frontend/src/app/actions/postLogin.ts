"use server";

import { cookies } from "next/headers";
import { fetcher } from "@/utils/fetcher";
import { redirect } from "next/navigation";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function postLoginAction(data: LoginData) {
  try {
    const res: LoginResponse = await fetcher("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const cookieStore = await cookies();
    // Consider using a refresh_token for long-term token renewal
    cookieStore.set("access_token", res.access_token, {
      httpOnly: true,
      maxAge: res.expires_in,
    });
    redirect("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
