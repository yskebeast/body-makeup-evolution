"use server";

import { cookies } from "next/headers";
import { fetcher } from "@/utils/fetcher";
import { ProfileFormData } from "@/schemas/profileForm";

export async function updateProfileAction(userId: number, data: ProfileFormData) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      throw new Error("認証が必要です");
    }

    const response = await fetcher("/auth/profile/update/", {
      method: "PATCH",
      body: JSON.stringify({
        user_id: userId,
        ...data,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw error;
  }
}
