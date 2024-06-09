import React from "react";
import { Card, Table, Typography } from "antd";
import { useCart } from "../contexts/CartContext";

const { Title } = Typography;

function Cart() {
  const { cart } = useCart();

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["productId", "name"],
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Title level={2}>Your Cart</Title>
        <Table
          dataSource={cart}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default Cart;
