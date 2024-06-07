import { Col, Divider, Row, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const { Title } = Typography;
function ProductsSection({ title, products }) {
  return (
    <>
      <Title level={3}>{title}</Title>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Link to={`/sell/product/${product._id}`}>
              <ProductCard product={product} />
            </Link>
          </Col>
        ))}
      </Row>
      <Divider />
    </>
  );
}

export default ProductsSection;
