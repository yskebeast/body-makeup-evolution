import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .email({ message: "有効なメールアドレスを入力してください" })
    .min(1, { message: "メールアドレスを入力してください" }),
  password: z
    .string()
    .min(1, { message: "パスワードを入力してください" })
    .min(6, { message: "パスワードは6文字以上である必要があります" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
