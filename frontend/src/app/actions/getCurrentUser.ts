"use server";

import { fetcher } from "@/utils/fetcher";
import { cookies } from "next/headers";

export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export async function getCurrentUserAction(): Promise<any | null> {
  const cookieStore = await cookies();
  try {
    const res: User = await fetcher("/auth/userinfo/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookieStore.get("access_token")?.value}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
