import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function AuthLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-center text-sm text-black">
            アカウントをお持ちでない方は
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              こちらから新規登録
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
