import { z } from "zod";

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "現在のパスワードは必須です"),
    newPassword: z
      .string()
      .min(8, "新しいパスワードは8文字以上で入力してください")
      .max(100, "新しいパスワードは100文字以内で入力してください"),
    confirmNewPassword: z.string().min(1, "パスワード確認は必須です"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "新しいパスワードと確認用パスワードが一致しません",
        path: ["confirmNewPassword"],
      });
    }

    if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "新しいパスワードは現在のパスワードと異なる必要があります",
        path: ["newPassword"],
      });
    }
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
