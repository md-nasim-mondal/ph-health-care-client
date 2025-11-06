/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";

const registerValidationSchema = z.object({
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

export const registerPatient = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const validationData = {
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validatedFields = registerValidationSchema.safeParse(validationData);

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

    const registerData = {
      password: formData.get("password"),
      patient: {
        name: formData.get("name"),
        email: formData.get("email"),
        address: formData.get("address"),
      },
    };

    const newFormData = new FormData();

    newFormData.append("data", JSON.stringify(registerData));

    const res = await fetch(
      "http://localhost:5000/api/v1/user/create-patient",
      {
        method: "POST",
        body: newFormData,
      }
    ).then((res) => res.json());

    return res;
  } catch (err) {
    console.log(err);
    return { error: "Registration Failed!" };
  }
};
