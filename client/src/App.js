import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import { UserProvider } from "./contexts/UserContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const UnauthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginRegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const { currentAuthUser } = useAuth();

  return (
    <div>{currentAuthUser ? <AuthenticatedApp /> : <UnauthenticatedApp />}</div>
  );
};

const Root = () => (
  <AuthProvider>
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  </AuthProvider>
);

export default Root;
