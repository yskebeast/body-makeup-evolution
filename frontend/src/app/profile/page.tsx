import { UserinfoApiResponse } from "@/schemas/userinfoApi";
import { fetcher } from "@/utils/fetcher";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function ProfilePage() {
  const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
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
      return null;
    }
  };
  const user = await getCurrentUser();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        {user && (
          <div className="flex gap-3">
            <Link
              href="/profile/edit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              プロフィールを編集
            </Link>
            <Link
              href="/profile/change-password"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              パスワード変更
            </Link>
          </div>
        )}
      </div>

      {user ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">名前</label>
              <p className="text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                メールアドレス
              </label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                ステータス
              </label>
              <p className="text-lg text-gray-900">
                {user.is_active ? "アクティブ" : "非アクティブ"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">ユーザー情報を読み込み中...</p>
        </div>
      )}
    </div>
  );
}
