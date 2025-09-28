import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(50, "名前は50文字以内で入力してください"),
  email: z.email({ message: "有効なメールアドレスを入力してください" }).min(1, "メールアドレスは必須です"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
