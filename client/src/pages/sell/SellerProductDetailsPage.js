import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Row, Col } from "antd";
import { Category, Stock } from "../../constants/eNums";

function SellerProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        message.error("Failed to retrieve product details");
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <div>
      {product ? (
        <Row gutter={16} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <img
              src={product.images}
              alt={product.name}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={12}>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <h2>${product.price}</h2>
            <p>Category: {Category[product.category]}</p>
            <p>Stock: {Stock[product.stock]}</p>
          </Col>
        </Row>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SellerProductDetails;
