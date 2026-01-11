/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";

export const registerPatientValidationSchema = z.object({
  name: z.string().min(2, {
    error: "Name is required and length should be minimum 2 character!",
  }),
  address: z.string().optional(),
  email: z.string().email({ error: "Invalid email address!" }),
  password: z
    .string()
    .min(6, {
      error: "Password is required and length should be minimum 6 character!",
    })
    .max(100, { error: "Password length can be maximum 100 character!" }),
  confirmPassword: z
    .string()
    .min(6, {
      error: "Password is required and length should be minimum 6 character!",
    })
    .max(100, { error: "Password length can be maximum 100 character!" })
    .refine((data: any) => data.password === data?.confirmPassword, {
      error: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});


export const loginValidationSchema = z.object({
  email: z.email({
    error: "Invalid email address!",
  }),
  password: z
    .string()
    .min(6, {
      error: "Password is required and length should be minimum 6 character!",
    })
    .max(100, { error: "Password length can be maximum 100 character!" }),
});
