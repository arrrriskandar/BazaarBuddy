import React from "react";
import { useCart } from "../contexts/CartContext";
import {
  Button,
  InputNumber,
  List,
  Avatar,
  Row,
  Col,
  Space,
  message,
} from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Cart = () => {
  const { carts, removeFromCart, updateQuantity, deleteCart } = useCart();

  const handleRemove = async (id, product) => {
    try {
      await removeFromCart(id, product);
      message.success("Product removed from cart!");
    } catch (error) {
      message.error(
        "Failed to remove item from cart. Please try again",
        error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCart(id);
      message.success("Cart deleted!");
    } catch (error) {
      message.error("Failed to delete cart. Please try again", error.message);
    }
  };

  const handleQuantityChange = async (id, product, quantity) => {
    try {
      await updateQuantity(id, product, quantity);
      message.success("Product quantity changed!");
    } catch (error) {
      message.error(
        "Failed to update quantity. Please try again",
        error.message
      );
    }
  };

  return (
    <div>
      {carts.length > 0 ? (
        carts.map((cart) => (
          <div key={cart._id} style={{ marginBottom: "20px" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Row align="middle">
                  <Avatar
                    src={cart.seller.photoUrl || "/default-avatar.png"}
                    style={{ marginRight: "10px" }}
                  />
                  <h1 style={{ margin: 0 }}>{cart.seller.username}</h1>
                </Row>
              </Col>
              <Col>
                <Button
                  danger
                  type="text"
                  onClick={() => handleDelete(cart._id)}
                >
                  x
                </Button>
              </Col>
            </Row>
            <List
              itemLayout="horizontal"
              dataSource={cart.items}
              renderItem={(item) => (
                <List.Item>
                  <Row style={{ width: "100%" }} align="top" gutter={16}>
                    <Col>
                      <Avatar
                        shape="square"
                        src={item.product.images}
                        size={200}
                      />
                    </Col>
                    <Col flex="auto">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <h2 style={{ margin: 0 }}>{item.product.name}</h2>
                        <Space
                          direction="vertical"
                          style={{ marginTop: "10px" }}
                        >
                          <div>Price: ${item.product.price}</div>
                          <Row align="middle">
                            <Col>
                              <span>Quantity: </span>
                            </Col>
                            <Col>
                              <InputNumber
                                min={1}
                                value={item.quantity}
                                onChange={(value) =>
                                  handleQuantityChange(
                                    cart._id,
                                    item.product._id,
                                    value
                                  )
                                }
                              />
                            </Col>
                          </Row>
                        </Space>
                      </div>
                    </Col>
                    <Col>
                      {cart.items.length > 1 && (
                        <Button
                          danger
                          onClick={() =>
                            handleRemove(cart._id, item.product._id)
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        ))
      ) : (
        <div
          style={{
            display: "flex",
            minHeight: "50vh",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h2>Your cart is empty</h2>
          <Button type="primary" icon={<ShoppingOutlined />}>
            <Link to="/buy/product">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
