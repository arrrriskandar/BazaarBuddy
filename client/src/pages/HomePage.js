import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button type="primary" onClick={() => navigate("/profile")}>
        Profile
      </Button>
      <Button type="primary" onClick={() => navigate("/buy")}>
        Buy
      </Button>
    </div>
  );
};

export default Home;
