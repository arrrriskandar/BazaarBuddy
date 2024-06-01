import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WechatOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const TopNavigation = () => {
  const location = useLocation();
  const getSelectedKey = () => {
    if (location.pathname.startsWith("/buy")) return "1";
    if (location.pathname.startsWith("/sell")) return "2";
    if (location.pathname.startsWith("/chat")) return "3";
    if (location.pathname.startsWith("/cart")) return "4";
    if (location.pathname.startsWith("/profile")) return "5";
    return "1";
  };
  const selectedKey = getSelectedKey();
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
        <img
          src="/logo3.png"
          alt="Your Logo"
          style={{ maxHeight: "100%", marginRight: "5px" }}
        />
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Menu.Item key="1" icon={<ShoppingOutlined />}>
          <Link to="/buy/product">Buy</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<DollarOutlined />}>
          <Link to="/">Sell</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<WechatOutlined />}>
          <Link to="/">Chats</Link>
        </Menu.Item>
      </Menu>
      {getSelectedKey() + "    getSelectedKey"}
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
          <Link to="/cart"></Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<UserOutlined />}>
          <Link to="/profile"></Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default TopNavigation;
