"use server";

import { RegisterApiRequest } from "@/schemas/registerApi";
import { fetcher } from "@/utils/fetcher";

export async function postRegisterAction(data: RegisterApiRequest) {
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
