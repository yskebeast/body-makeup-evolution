import { getAuthenticatedUser } from "@/utils/auth";
import { EditProfileForm } from "@/components/profile/EditProfileForm";

export default async function EditProfilePage() {
  const user = await getAuthenticatedUser();

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
