import React, { useEffect, useState } from "react";
import { apiEndpoint } from "../constants";
import axios from "axios";
import { message, Card, Row, Col, Rate } from "antd";

const { Meta } = Card;

function BrowseProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiEndpoint + "/product");
        setProducts(response.data);
      } catch (error) {
        message.error("Failed to retrieve products");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {products.map((product) => {
          const averageRating = product.ratingCount
            ? product.ratingSum / product.ratingCount
            : 0;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.images} />}
              >
                <Meta title={product.name} description={`$${product.price}`} />
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <Rate disabled defaultValue={averageRating} />
                  <div>{averageRating.toFixed(1)} / 5</div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default BrowseProducts;
