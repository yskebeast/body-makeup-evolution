import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "名前は必須です").max(50, "名前は50文字以内で入力してください"),
    email: z.email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .max(50, "パスワードは50文字以内で入力してください"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
