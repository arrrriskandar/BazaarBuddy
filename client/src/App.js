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
import CartCheckout from "./pages/checkout/CartCheckOutPage";
import SellerOrdersPage from "./pages/sell/OrdersPage";
import BuyerOrdersPage from "./pages/buy/OrdersPage";
import ProductCheckout from "./pages/checkout/ProductCheckOutPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import { SocketProvider } from "./contexts/SocketContext";
import Notification from "./pages/NotificationPage";
import NotificationDetail from "./pages/NotificationDetailsPage";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ChatProvider } from "./contexts/ChatContext";
import ChatPage from "./pages/ChatPage";

const AuthenticatedApp = () => {
  return (
    <Layout>
      <TopNavigation />
      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notification" element={<Notification />} />
          <Route
            path="/notification/:orderId"
            element={<NotificationDetail />}
          />
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
          <Route path="/cart/checkout" element={<CartCheckout />} />
          <Route path="/buy/checkout" element={<ProductCheckout />} />
          <Route path="/sell/order" element={<SellerOrdersPage />} />
          <Route path="/buy/order" element={<BuyerOrdersPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
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
          <SocketProvider>
            <ChatProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </ChatProvider>
          </SocketProvider>
        </CartProvider>
      </Router>
    </UserProvider>
  </AuthProvider>
);

export default Root;
