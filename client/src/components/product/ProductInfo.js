import { Typography, Descriptions } from "antd";
import React from "react";

const { Title, Paragraph } = Typography;

function ProductInfo({ product }) {
  return (
    <>
      <Title level={1}>{product.name}</Title>
      <h2>
        {product.averageRating > 0 ? (
          <>
            {product.averageRating.toFixed(1)} ⭐ ({product.ratingCount}{" "}
            reviews)
          </>
        ) : (
          "No reviews"
        )}
      </h2>
      <Paragraph>{product.description}</Paragraph>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Price">
          {`$${Number(product.price).toFixed(2)}`}
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          {product.category}
        </Descriptions.Item>
        <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
      </Descriptions>
    </>
  );
}

export default ProductInfo;
