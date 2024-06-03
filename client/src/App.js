import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import TopNavigation from "./components/common/TopNavigation";
import { Content } from "antd/es/layout/layout";
import SellerProducts from "./pages/sell/SellerProductsPage";

const AuthenticatedApp = () => {
  return (
    <Layout>
      <TopNavigation />
      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/buy/product" element={<BrowseProducts />} />
          <Route path="/buy/product/:productId" element={<ProductDetails />} />
          <Route path="/sell/product" element={<SellerProducts />} />
          <Route path="*" element={<Navigate to="/buy/product" replace />} />
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
