"use client";

import { UserinfoApiResponse } from "@/schemas/userinfoApi";
import {
  ChangePasswordFormData,
  changePasswordFormSchema,
} from "@/schemas/changePasswordForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { updatePasswordAction } from "@/app/actions/updatePassword";

interface ChangePasswordFormProps {
  user: UserinfoApiResponse;
}

export const ChangePasswordForm = ({ user }: ChangePasswordFormProps) => {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
    getValues,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const password = getValues("newPassword");
    const confirmPassword = getValues("confirmNewPassword");

    if (password !== confirmPassword) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("submitting");
    try {
      await updatePasswordAction(user.id, data);

      reset(data, {
        keepValues: true,
        keepDefaultValues: false,
      });

      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Current Password */}
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          現在のパスワード
        </label>
        <input
          type="password"
          id="currentPassword"
          {...register("currentPassword")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="現在のパスワードを入力"
        />
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          新しいパスワード
        </label>
        <input
          type="password"
          id="newPassword"
          {...register("newPassword")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="新しいパスワードを入力（8文字以上）"
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label
          htmlFor="confirmNewPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          新しいパスワード（確認）
        </label>
        <input
          type="password"
          id="confirmNewPassword"
          {...register("confirmNewPassword")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="新しいパスワードをもう一度入力"
        />
        {errors.confirmNewPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      {/* Status Message */}
      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">パスワードが正常に変更されました。</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            パスワードの変更に失敗しました。現在のパスワードが正しいか確認してください。
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitStatus === "submitting" || !isDirty || !isValid}
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {submitStatus === "submitting" ? "変更中..." : "パスワードを変更"}
        </button>

        <Link
          href="/profile"
          className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          キャンセル
        </Link>
      </div>
    </form>
  );
};
