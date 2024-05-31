import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import LoginRegister from "./pages/LoginRegisterPage";
import { UserProvider } from "./contexts/UserContext";
import ProductDetails from "./pages/buy/ProductDetailsPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BrowseProducts from "./pages/buy/BrowseProductsPage";
import { Layout } from "antd";
import TopNavigation from "./components/Common/TopNavigation";
import { Content } from "antd/es/layout/layout";

const AuthenticatedApp = () => {
  return (
    <Layout>
      <TopNavigation />
      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/buy/product" element={<BrowseProducts />} />
          <Route path="/buy/product/:productId" element={<ProductDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
};

const UnauthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginRegister />} />
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
