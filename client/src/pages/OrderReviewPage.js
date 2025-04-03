import React, { useEffect, useState } from "react";
import { Image, message, Spin, Typography } from "antd"; // Add Spin for loading indicator
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
import ReviewCard from "../components/review/ReviewCard";

function OrderReviewPage() {
  const { orderId } = useParams();
  const [reviews, setReviews] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const { Text } = Typography;

  useEffect(() => {
    const fetchReviewsByOrder = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}/review/order/${orderId}`
        );
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        message.error("Failed to retrieve reviews. Please try again."); // Error message should relate to reviews
        console.error("Failed to retrieve reviews", error); // Error message should relate to reviews
        setLoading(false); // Stop loading if there's an error
      }
    };

    if (orderId) {
      fetchReviewsByOrder();
    }
  }, [orderId]);

  if (loading) {
    return <Spin size="large" style={{ margin: "20px auto" }} />; // Loading spinner
  }

  return (
    <div style={{ padding: "20px" }}>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} style={{ marginBottom: "20px" }}>
            {/* Display Product Name and Image */}
            <div style={{ marginBottom: "16px" }}>
              <Typography.Title level={3}>
                {review.product.name}
              </Typography.Title>
              {review.product.images && (
                <Image
                  width={200}
                  src={review.product.images}
                  alt={review.product.name}
                  style={{ marginBottom: "8px" }}
                />
              )}
            </div>

            {/* Render ReviewCard */}
            <ReviewCard review={review} />
          </div>
        ))
      ) : (
        <Text type="secondary">No reviews available.</Text>
      )}
    </div>
  );
}

export default OrderReviewPage;
