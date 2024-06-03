import { useState } from "react";
import RegisterForm from "../components/auth/RegisterForm";
import LoginForm from "../components/auth/LoginForm";

function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);

  const toggleRegister = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div>
      {isRegister ? (
        <RegisterForm toggleRegister={toggleRegister} />
      ) : (
        <LoginForm toggleRegister={toggleRegister} />
      )}
    </div>
  );
}

export default LoginRegister;
