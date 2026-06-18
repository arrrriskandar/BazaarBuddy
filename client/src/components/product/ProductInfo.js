import { Typography, Descriptions, Badge, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
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
          {product.isCategorized ? (
            product.category
          ) : (
            <Tooltip title="Our AI is analyzing your listing details. This process takes 1–2 minutes. You can refresh this page or check back later!">
              <span style={{ cursor: "help" }}>
                <Badge status="processing" text="✨ AI Categorizing... " />
                <InfoCircleOutlined
                  style={{ color: "#1890ff", marginLeft: 4 }}
                />
              </span>
            </Tooltip>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
      </Descriptions>
    </>
  );
}

export default ProductInfo;
