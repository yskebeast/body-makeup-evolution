import { getCurrentUserAction } from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg mb-2 text-black">ようこそ、{user.name}さん！</p>
        <p className="text-black">メールアドレス: {user.email}</p>
        <p className="text-sm text-black mt-2">
          アカウント状態: {user.is_active ? "アクティブ" : "非アクティブ"}
        </p>
      </div>
    </div>
  );
}
