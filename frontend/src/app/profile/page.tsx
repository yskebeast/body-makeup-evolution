import { getAuthenticatedUser } from "@/utils/auth";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
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
      </div>

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
    </div>
  );
}
