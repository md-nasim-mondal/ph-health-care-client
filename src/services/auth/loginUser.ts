/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import z from "zod";
import { parse } from "cookie";
import { cookies } from "next/headers";

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
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

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
    });

    const result = await res.json();

    const setCookieHeaders = res.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        console.log(cookie, "for each cookie");
        const parsedCookie = parse(cookie);
        console.log(parsedCookie, "parsed cookie");

        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });

    } else {
      throw new Error("No Set-Cookie header found!");
    }

      if(!accessTokenObject || !refreshTokenObject){
        throw new Error("Tokens not found in cookies");
      }

      const cookieStore = await cookies();

      cookieStore.set("accessToken", accessTokenObject.accessToken, {
        secure: true,
        httpOnly: true,
        maxAge: parseInt(accessTokenObject.maxAge),
        path: accessTokenObject.Path || "/"
      });

      cookieStore.set("refreshToken", refreshTokenObject.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: parseInt(accessTokenObject.maxAge),
        path: accessTokenObject.Path || "/"
      })


    return result;
  } catch (err) {
    console.log(err);
    return { error: "Login Failed" };
  }
};
