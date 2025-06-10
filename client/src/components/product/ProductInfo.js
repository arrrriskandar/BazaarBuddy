import { Typography, Descriptions } from "antd";
import React from "react";
import { getAverageRating } from "../../utils/ratingUtils";

const { Title, Paragraph } = Typography;

function ProductInfo({ product }) {
  const averageProductRating = getAverageRating(
    product.ratingCount,
    product.ratingTotal
  );
  return (
    <>
      <Title level={1}>{product.name}</Title>
      <h2>
        {product.ratingCount > 0 ? (
          <>
            {averageProductRating.toFixed(1)} ⭐ ({product.ratingCount} reviews)
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
