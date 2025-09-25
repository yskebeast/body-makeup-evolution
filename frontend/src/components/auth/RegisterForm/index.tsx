"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterFormValues } from "@/schemas/register";
import { postRegisterAction } from "@/app/actions/postRegister";

export const RegisterForm = () => {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitStatus("submitting");
    try {
      const { confirmPassword, ...submitData } = data;
      const res = await postRegisterAction(submitData);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  return (
    <div className="w-full max-w-md">
      {submitStatus !== "success" && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black mb-2"
            >
              名前
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="お名前を入力"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          {/* email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-2"
            >
              メールアドレス
            </label>
            <input
              id="name"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="メールアドレスを入力"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          {/* password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-2"
            >
              パスワード
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="パスワードを入力（8文字以上）"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-black mb-2"
            >
              パスワード（確認）
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="パスワードを再入力"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitStatus === "submitting"}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {submitStatus === "submitting" ? "登録中..." : "アカウント作成"}
          </button>
        </form>
      )}

      {submitStatus === "success" && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-center mb-2">
            アカウントの作成が完了しました！
          </p>
          <p className="text-center">
            <a
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              こちらからログインしてください →
            </a>
          </p>
        </div>
      )}
    </div>
  );
};
