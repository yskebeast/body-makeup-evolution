"use server";

import { fetcher } from "@/utils/fetcher";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function postRegisterAction(data: RegisterData) {
  try {
    const res = await fetcher("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}
