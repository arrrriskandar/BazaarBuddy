import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Profile from "./pages/ProfilePage";
import LoginRegister from "./pages/LoginRegisterPage";
import { UserProvider } from "./contexts/UserContext";
import BrowseProductDetails from "./pages/buy/ProductDetailsPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BrowseProducts from "./pages/buy/ProductsPage";
import { Layout } from "antd";
import TopNavigation from "./components/common/TopNavigation";
import { Content } from "antd/es/layout/layout";
import SellerProducts from "./pages/sell/ProductsPage";
import SellerProductDetails from "./pages/sell/ProductDetailsPage";
import Cart from "./pages/CartPage";
import { CartProvider } from "./contexts/CartContext";

const AuthenticatedApp = () => {
  return (
    <Layout>
      <TopNavigation />
      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/buy/product" element={<BrowseProducts />} />
          <Route
            path="/buy/product/:productId"
            element={<BrowseProductDetails />}
          />
          <Route path="/sell/product" element={<SellerProducts />} />
          <Route
            path="/sell/product/:productId"
            element={<SellerProductDetails />}
          />
          <Route path="/cart" element={<Cart />} />
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
        <CartProvider>
          <App />
        </CartProvider>
      </Router>
    </UserProvider>
  </AuthProvider>
);

export default Root;
