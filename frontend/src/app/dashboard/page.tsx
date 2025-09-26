import { UserinfoApiResponse } from "@/schemas/userinfoApi";
import { fetcher } from "@/utils/fetcher";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return null;
    }

    try {
      return await fetcher<UserinfoApiResponse>("/auth/userinfo/", {
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
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <div>
          <p>
            Welcome, {user.id} : {user.name}
          </p>
          <p>Email: {user.email}</p>
          <p>Status: {user.is_active ? "Active" : "Inactive"}</p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}
