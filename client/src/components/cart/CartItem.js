import React from "react";
import {
  Row,
  Col,
  Checkbox,
  Avatar,
  InputNumber,
  Button,
  Space,
  List,
} from "antd";

const CartItem = ({
  cartId,
  item,
  isChecked,
  handleCheckboxChange,
  handleQuantityChange,
  handleRemove,
  cart,
}) => (
  <List.Item>
    <Row style={{ width: "100%" }} align="top" gutter={16}>
      <Col>
        <Checkbox
          checked={isChecked(cartId, item.product._id)}
          onChange={(e) =>
            handleCheckboxChange(cartId, item.product._id, e.target.checked)
          }
        />
      </Col>
      <Col>
        <Avatar shape="square" src={item.product.images} size={200} />
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
          <Space direction="vertical" style={{ marginTop: "10px" }}>
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
                    handleQuantityChange(cartId, item.product._id, value)
                  }
                />
              </Col>
            </Row>
          </Space>
        </div>
      </Col>
      <Col>
        {cart.items.length > 1 && (
          <Button danger onClick={() => handleRemove(cartId, item.product._id)}>
            Remove
          </Button>
        )}
      </Col>
    </Row>
  </List.Item>
);

export default CartItem;
