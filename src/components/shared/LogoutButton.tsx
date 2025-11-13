"client component";

import { logoutUser } from "@/services/auth/logoutUser";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const handleLogout = async () => {
    await logoutUser();
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
