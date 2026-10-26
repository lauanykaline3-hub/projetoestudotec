import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um endereço de e-mail válido.")
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "Informe um endereço terminado em @gmail.com.",
    }),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
