import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/HomePage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import { UserProvider } from "./contexts/UserContext";

const AuthenticatedApp = () => {
  return (
    <>
      <Home />
    </>
  );
};

const UnauthenticatedApp = () => {
  return <LoginRegisterPage />;
};

const App = () => {
  const { currentAuthUser } = useAuth();

  return (
    <div className="App">
      {currentAuthUser ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </div>
  );
};

const Root = () => (
  <AuthProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </AuthProvider>
);

export default Root;
