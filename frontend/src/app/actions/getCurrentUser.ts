"use server";

import { fetcher } from "@/utils/fetcher";
import { cookies } from "next/headers";
import { refreshTokenAction } from "./postRefreshToken";

export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

const fetchUserWithToken = async (token: string): Promise<User | null> => {
  try {
    return await fetcher<User>("/auth/userinfo/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

const tryRefreshAndFetchUser = async (): Promise<User | null> => {
  const refreshSuccess = await refreshTokenAction();

  if (!refreshSuccess) {
    return null;
  }

  const cookieStore = await cookies();
  const newAccessToken = cookieStore.get("access_token")?.value;

  if (!newAccessToken) {
    return null;
  }

  return fetchUserWithToken(newAccessToken);
};

export async function getCurrentUserAction(): Promise<User | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return null;
  }

  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) {
    const user = await fetchUserWithToken(accessToken);
    if (user) {
      return user;
    }
  }

  return tryRefreshAndFetchUser();
}
