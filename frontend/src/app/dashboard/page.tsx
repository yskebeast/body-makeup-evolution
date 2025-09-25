"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserAction, type User } from "@/app/actions/getCurrentUser";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUserAction();
        if (!userData) {
          router.push("/auth/login");
          return;
        }
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
