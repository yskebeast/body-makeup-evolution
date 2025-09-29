import { UserinfoApiResponse } from "@/schemas/userinfoApi";
import { fetcher } from "@/utils/fetcher";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import Link from "next/link";

export default async function ChangePasswordPage() {
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
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/profile"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← プロフィールに戻る
          </Link>
        </div>
        <h1 className="text-2xl font-bold">パスワード変更</h1>
        <p className="text-gray-600 mt-2">セキュリティのため、現在のパスワードと新しいパスワードを入力してください</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ChangePasswordForm user={user} />
      </div>
    </div>
  );
}