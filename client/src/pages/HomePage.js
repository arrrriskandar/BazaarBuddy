import React from "react";
import LogoutButton from "../components/Auth/LogoutButton";
import { useUser } from "../contexts/UserContext";

const Home = () => {
  const { currentUser } = useUser();

  return (
    <div>
      <h1>{JSON.stringify(currentUser)}</h1>
      <LogoutButton />
    </div>
  );
};

export default Home;
