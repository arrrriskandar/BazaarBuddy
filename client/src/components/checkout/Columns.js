// src/components/checkout/columns.js

import React from "react";
import { Row, Col, Avatar, Typography } from "antd";

const { Title } = Typography;

const getColumns = () => [
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
    render: (product) => (
      <Row align="middle">
        <Col>
          <Avatar src={product.images} size={64} />
        </Col>
        <Col style={{ paddingLeft: "10px" }}>
          <Title level={5} style={{ margin: 0 }}>
            {product.name}
          </Title>
        </Col>
      </Row>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    align: "center",
    render: (price) => `$${price.toFixed(2)}`,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "center",
    render: (total) => `$${total.toFixed(2)}`,
  },
];

export default getColumns;
