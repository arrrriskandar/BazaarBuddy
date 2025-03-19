import { Card, Rate } from "antd";
import React from "react";

const { Meta } = Card;

function ProductCard({ product }) {
  const averageRating =
    product.ratingCount > 0
      ? (product.ratingTotal / product.ratingCount).toFixed(1)
      : 0;
  return (
    <Card
      hoverable
      style={{ height: "100%" }}
      cover={
        <div
          style={{
            height: "200px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            alt={product.name}
            src={product.images}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      }
    >
      <Meta title={product.name} description={`$${product.price}`} />
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {product.ratingCount > 0 ? (
          <>
            <Rate disabled value={parseFloat(averageRating)} />
            <div>{averageRating} / 5.0</div>
            <div>{product.ratingCount} reviews</div>
          </>
        ) : (
          <div>No reviews</div>
        )}
      </div>
    </Card>
  );
}

export default ProductCard;
