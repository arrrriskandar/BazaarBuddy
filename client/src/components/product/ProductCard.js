import { Card } from "antd";
import React from "react";
import { getAverageRating } from "../../utils/ratingUtils";
import StarRatings from "react-star-ratings";

const { Meta } = Card;

function ProductCard({ product }) {
  const averageRating = getAverageRating(
    product.ratingCount,
    product.ratingTotal
  );

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
            <StarRatings
              rating={averageRating}
              starRatedColor="gold"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
            />
            <div>
              {averageRating.toFixed(1)} ⭐ ({product.ratingCount} reviews)
            </div>
            <div></div>
          </>
        ) : (
          <div>No reviews</div>
        )}
      </div>
    </Card>
  );
}

export default ProductCard;
