import React from "react";
import { Button, message } from "antd";
import { logout } from "../../firebase/auth";
import { useAuth } from "../../contexts/AuthContext";

const LogoutButton = () => {
  const { setCurrentAuthUser } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentAuthUser(null);
      message.success("Logged out successfully!");
    } catch (error) {
      message.error("Failed to log out. Please try again.");
      console.error("Log out error", error);
    }
  };

  return (
    <div>
      <Button danger onClick={handleLogout} style={{ minWidth: "100px" }}>
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
