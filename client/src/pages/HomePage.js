import React from "react";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/Auth/LogoutButton";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1>{JSON.stringify(currentUser)}</h1>
      <LogoutButton />
    </div>
  );
};

export default Home;
