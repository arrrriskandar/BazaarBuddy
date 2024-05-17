import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/HomePage";
import LoginRegisterPage from "./pages/LoginRegisterPage";

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
  const { currentUser } = useAuth();

  return (
    <div className="App">
      {currentUser ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </div>
  );
};

const Root = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default Root;
