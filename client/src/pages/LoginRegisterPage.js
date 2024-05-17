import { useState } from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import LoginForm from "../components/Auth/LoginForm";

function LoginRegisterPage() {
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

export default LoginRegisterPage;
