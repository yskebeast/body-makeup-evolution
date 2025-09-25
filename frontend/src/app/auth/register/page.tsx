import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function AuthRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
            新規アカウント作成
          </h2>
          <p className="mt-2 text-center text-sm text-black">
            すでにアカウントをお持ちの方は
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              こちらからログイン
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
