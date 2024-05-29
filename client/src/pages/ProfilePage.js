import React from "react";
import LogoutButton from "../components/Auth/LogoutButton";
import { useUser } from "../contexts/UserContext";

function Profile() {
  const { currentUser } = useUser();

  return (
    <div>
      <h1>{JSON.stringify(currentUser)}</h1>
      <LogoutButton />
    </div>
  );
}

export default Profile;
