"use server";

import { cookies } from "next/headers";
import { fetcher } from "@/utils/fetcher";
import { ChangePasswordFormData } from "@/schemas/changePasswordForm";

export async function updatePasswordAction(userId: number, data: ChangePasswordFormData) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      throw new Error("認証が必要です");
    }

    const response = await fetcher("/auth/password/update/", {
      method: "PATCH",
      body: JSON.stringify({
        user_id: userId,
        current_password: data.currentPassword,
        new_password: data.newPassword,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Password updated successfully:", response);
    return response;
  } catch (error) {
    console.error("Password update failed:", error);
    throw error;
  }
}
