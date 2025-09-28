"use client";

import { UserinfoApiResponse } from "@/schemas/userinfoApi";
import { ProfileFormData, profileFormSchema } from "@/schemas/profileForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfileAction } from "@/app/actions/updateProfile";

interface EditProfileFormProps {
  user: UserinfoApiResponse;
}

export const EditProfileForm = ({ user }: EditProfileFormProps) => {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setSubmitStatus("submitting");
    try {
      await updateProfileAction(user.id, data);

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
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          名前
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="名前を入力"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="メールアドレスを入力"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Status Message */}
      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            プロフィールが正常に更新されました。プロフィールページへリダイレクトします...
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            プロフィールの更新に失敗しました。もう一度お試しください。
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitStatus === "submitting" || !isDirty}
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {submitStatus === "submitting" ? "更新中..." : "保存"}
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
