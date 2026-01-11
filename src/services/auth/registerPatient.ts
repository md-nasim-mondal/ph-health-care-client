/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { loginUser } from "./loginUser";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerPatientValidationSchema } from "@/zod/auth.validation";

export const registerPatient = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload = {
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // const validatedFields = registerValidationSchema.safeParse(validationData);

    // if (!validatedFields.success) {
    //   return {
    //     success: false,
    //     errors: validatedFields.error.issues.map((issue) => {
    //       return {
    //         field: issue.path[0],
    //         message: issue.message,
    //       };
    //     }),
    //   };
    // }

    if (
      zodValidator(payload, registerPatientValidationSchema).success === false
    ) {
      return zodValidator(payload, registerPatientValidationSchema);
    }

    const validatedPayload: any = zodValidator(
      payload,
      registerPatientValidationSchema
    ).data;

    const registerData = {
      password: validatedPayload.password,
      patient: {
        name: validatedPayload.name,
        email: validatedPayload.email,
        address: validatedPayload.address,
      },
    };

    const newFormData = new FormData();

    newFormData.append("data", JSON.stringify(registerData));

    if (formData.get("file")) {
      newFormData.append("file", formData.get("file") as Blob);
    }

    const res = await serverFetch.post("/user/create-patient", {
      body: newFormData,
    });

    const result = await res.json();

    if (result.success) {
      await loginUser(_currentState, formData);
    }

    return result;
  } catch (err: any) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.log(err);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? err.message
          : "Registration Failed. Please try again!"
      }`,
    };
  }
};
