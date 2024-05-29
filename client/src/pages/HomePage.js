import React from "react";
import { Button } from "antd";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  return (
    <div>
      <h1>{JSON.stringify(currentUser)}</h1>
      <Button type="primary" onClick={() => navigate("/profile")}>
        Profile
      </Button>
    </div>
  );
};

export default Home;
