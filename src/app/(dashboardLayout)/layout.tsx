import LogoutButton from "@/components/shared/LogoutButton";
import { getCookie } from "@/services/auth/tokenHandlers";
import React from "react";

const CommonDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const accessToken = await getCookie("accessToken");
  return (
    <div>
      {accessToken && <LogoutButton />}
      {children}
    </div>
  );
};

export default CommonDashboardLayout;
