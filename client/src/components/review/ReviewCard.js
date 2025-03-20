import React from "react";
import { Card, Rate, Typography, Avatar } from "antd";

const { Text } = Typography;

function ReviewCard({ review }) {
  return (
    <Card style={{ marginBottom: "16px", padding: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <Avatar
          src={review.user.photoUrl || "/default-avatar.png"} // Fallback to default avatar if no photoUrl
          size="large"
        />
        <Typography.Title
          level={4}
          style={{
            margin: 0, // Remove default margins
            fontWeight: 500,
            lineHeight: 1.2, // Ensures text remains properly aligned
          }}
        >
          {review.user.username}
        </Typography.Title>
      </div>
      <Rate disabled value={review.rating} />
      <p>{review.comment}</p>
      <Text type="secondary">
        {new Date(review.reviewDate).toLocaleDateString()}
      </Text>
    </Card>
  );
}

export default ReviewCard;
