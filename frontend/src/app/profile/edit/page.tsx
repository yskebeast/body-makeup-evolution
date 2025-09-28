import { UserinfoApiResponse } from "@/schemas/userinfoApi";
import { fetcher } from "@/utils/fetcher";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/profile/EditProfileForm";

export default async function EditProfilePage() {
  const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      redirect("/auth/login");
    }

    try {
      return await fetcher<UserinfoApiResponse>("/auth/userinfo/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      redirect("/auth/login");
    }
  };

  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">プロフィール編集</h1>
        <p className="text-gray-600 mt-2">プロフィール情報を更新してください</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <EditProfileForm user={user} />
      </div>
    </div>
  );
}
