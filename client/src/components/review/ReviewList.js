import { useState, useEffect } from "react";
import axios from "axios";
import {
  Pagination,
  Select,
  Rate,
  Card,
  Progress,
  Typography,
  message,
} from "antd";
import ReviewCard from "./ReviewCard"; // Assuming you have a ReviewCard component
import { apiEndpoint } from "../../constants/constants";

const { Option } = Select;
const { Text } = Typography;

function ReviewList({ product }) {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("date_desc"); // Default sort by date descending
  const [selectedRating, setSelectedRating] = useState(null); // Default: View All Reviews
  const [ratingBreakdown, setRatingBreakdown] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/review`, {
          params: {
            product,
            rating: selectedRating, // Send the selected rating to backend
            sortBy,
            page,
            limit: 10,
          },
        });
        setReviews(response.data.reviews);
        setTotalReviews(response.data.totalReviews);
        setRatingBreakdown(response.data.ratingBreakdown); // Set the breakdown of reviews
      } catch (error) {
        message.error("Failed to fetch reviews. Please try again.");
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [product, selectedRating, sortBy, page]);

  // Handlers for filter changes
  const handleRatingFilterChange = (value) => {
    setSelectedRating(value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Calculate total reviews for progress percentage
  const totalRatings = ratingBreakdown.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <Card bordered style={{ marginBottom: "20px", padding: "20px" }}>
      {/* Rating Breakdown */}
      <div style={{ marginBottom: "20px" }}>
        <Typography.Title level={4}>Reviews</Typography.Title>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "5px",
              backgroundColor:
                selectedRating === null ? "#e6f7ff" : "transparent",
              border:
                selectedRating === null
                  ? "1px solid #1890ff"
                  : "1px solid #d9d9d9",
            }}
            onClick={() => handleRatingFilterChange(null)}
          >
            <Text strong style={{ width: "120px", textAlign: "center" }}>
              All reviews
            </Text>
            <Progress
              percent={100} // Always full
              showInfo={false}
              style={{ flex: 1 }}
            />
            <Text style={{ marginLeft: "10px" }}>{totalRatings} reviews</Text>
          </div>

          {[5, 4, 3, 2, 1].map((star) => {
            const count =
              ratingBreakdown.find((item) => item.rating === star)?.count || 0;
            const percentage = totalRatings ? (count / totalRatings) * 100 : 0;
            return (
              <div
                key={star}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "5px",
                  backgroundColor:
                    selectedRating === star ? "#e6f7ff" : "transparent",
                  border:
                    selectedRating === star
                      ? "1px solid #1890ff"
                      : "1px solid #d9d9d9",
                }}
                onClick={() => handleRatingFilterChange(star)}
              >
                <Rate
                  disabled
                  value={star}
                  style={{ fontSize: "16px", width: "120px" }}
                />
                <Progress
                  percent={percentage}
                  showInfo={false}
                  style={{ flex: 1 }}
                />
                <Text style={{ marginLeft: "10px" }}>{count} reviews</Text>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sorting Options */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Select
          value={sortBy}
          onChange={handleSortChange}
          style={{ width: "220px" }}
        >
          <Option value="date_desc">Sort by Date (Newest First)</Option>
          <Option value="date_asc">Sort by Date (Oldest First)</Option>
          <Option value="rating_desc">Sort by Rating (Highest First)</Option>
          <Option value="rating_asc">Sort by Rating (Lowest First)</Option>
        </Select>
      </div>

      {/* Reviews */}
      <div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <Text type="secondary">No reviews available.</Text>
        )}
      </div>

      {/* Pagination */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          current={page}
          total={totalReviews}
          pageSize={10}
          onChange={handlePageChange}
          showTotal={(total) => `Page ${page} / ${Math.ceil(total / 10)}`}
        />
      </div>
    </Card>
  );
}

export default ReviewList;
