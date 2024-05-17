import React from "react";
import { Button } from "antd";
import { logout } from "../../firebase/auth";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
