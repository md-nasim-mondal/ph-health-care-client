/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import z from "zod";

const loginValidationSchema = z.object({
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

export const loginUser = async (_currentState: any, formData: FormData) => {
  try {
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedFields = loginValidationSchema.safeParse(loginData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues.map((issue) => {
          return {
            field: issue.path[0],
            message: issue.message,
          };
        }),
      };
    }

    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    return res;
  } catch (err) {
    console.log(err);
    return { error: "Login Failed" };
  }
};
