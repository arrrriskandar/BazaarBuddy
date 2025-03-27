import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Layout, Menu, Badge } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WechatOutlined,
  ShoppingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useCart } from "../../contexts/CartContext";
import { useNotifications } from "../../contexts/NotificationContext";

const { Header } = Layout;
const { SubMenu } = Menu;

const TopNavigation = () => {
  const location = useLocation();
  const { carts } = useCart();
  const { unreadCount } = useNotifications();

  const totalQuantity = carts.reduce(
    (acc, cart) =>
      acc + cart.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  const getSelectedKey = () => {
    if (location.pathname.startsWith("/buy")) {
      return ["1", location.pathname === "/buy/order" ? "1-2" : "1-1"];
    }
    if (location.pathname.startsWith("/sell")) {
      return ["2", location.pathname === "/sell/order" ? "2-2" : "2-1"];
    }
    if (location.pathname.startsWith("/chat")) return ["3"];
    if (location.pathname.startsWith("/cart")) return ["4"];
    if (location.pathname.startsWith("/notification")) return ["5"];
    if (location.pathname.startsWith("/profile")) return ["6"];
    return ["1"];
  };

  const selectedKeys = getSelectedKey();

  return (
    <Header
      style={{
        background: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <div
        className="logo"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link to="/buy/product">
          <Avatar src="/logo1.png" alt="BazaarBuddy" size={70} shape="square" />
        </Link>
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={selectedKeys}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <SubMenu
          key="1"
          title={
            <span>
              <ShoppingOutlined style={{ fontSize: "24px" }} />
              <span>Buy</span>
            </span>
          }
          style={{ width: "120px" }} // Adjusted width
        >
          <Menu.Item key="1-1">
            <Link to="/buy/product">Browse Products</Link>
          </Menu.Item>
          <Menu.Item key="1-2">
            <Link to="/buy/order">My Purchases</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="2"
          title={
            <span>
              <DollarOutlined style={{ fontSize: "24px" }} />
              <span>Sell</span>
            </span>
          }
          style={{ width: "120px" }} // Adjusted width
        >
          <Menu.Item key="2-1">
            <Link to="/sell/product">My Products</Link>
          </Menu.Item>
          <Menu.Item key="2-2">
            <Link to="/sell/order">My Sales</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item
          key="3"
          icon={<WechatOutlined style={{ fontSize: "24px" }} />}
          style={{ width: "120px" }} // Adjusted width
        >
          <Link to="/chat">Chats</Link>
        </Menu.Item>
      </Menu>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={selectedKeys}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Menu.Item
          key="4"
          icon={<ShoppingCartOutlined style={{ fontSize: "24px" }} />}
        >
          <Link to="/cart">
            <Badge
              count={totalQuantity}
              overflowCount={10}
              style={{
                backgroundColor: "#52c41a",
                boxShadow: "none",
                position: "absolute",
                top: "-30px",
                right: "-5px",
              }}
            ></Badge>
          </Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<BellOutlined style={{ fontSize: "24px" }} />}>
          <Link to="/notification">
            <Badge
              count={unreadCount}
              overflowCount={10}
              style={{
                backgroundColor: "#52c41a",
                boxShadow: "none",
                position: "absolute",
                top: "-30px",
                right: "-5px",
              }}
            ></Badge>
          </Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<UserOutlined style={{ fontSize: "24px" }} />}>
          <Link to="/profile" />
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default TopNavigation;
