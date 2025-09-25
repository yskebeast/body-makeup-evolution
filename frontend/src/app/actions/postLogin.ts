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
  refresh_token: string;
  refresh_expires_in: number;
}

export async function postLoginAction(data: LoginData) {
  try {
    const res: LoginResponse = await fetcher("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const cookieStore = await cookies();

    cookieStore.set("access_token", res.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: res.expires_in,
      sameSite: "strict",
    });

    cookieStore.set("refresh_token", res.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: res.refresh_expires_in,
      sameSite: "strict",
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
