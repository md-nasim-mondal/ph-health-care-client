"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const LoginSuccessToast = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("loggedIn") === "true") {
      toast.success("You have been logged in successfully!");
    }
  }, [searchParams]);

  return null;
};

export default LoginSuccessToast;
