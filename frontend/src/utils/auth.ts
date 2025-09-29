import { UserinfoApiResponse } from "@/schemas/userinfoApi";
import { fetcher } from "@/utils/fetcher";
import { cookies } from "next/headers";

export const getCurrentUser = async (): Promise<UserinfoApiResponse | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }

    return await fetcher<UserinfoApiResponse>("/auth/userinfo/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

export const getAuthenticatedUser = async (): Promise<UserinfoApiResponse> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user;
};
