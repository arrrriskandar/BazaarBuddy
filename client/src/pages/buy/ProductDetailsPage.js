import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiEndpoint } from "../../constants";
import axios from "axios";
import { message, Button, Row, Col } from "antd";

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    // Implement add to cart functionality
    message.success("Product added to cart!");
  };

  const handleBuyNow = () => {
    // Implement buy now functionality
    message.success("Proceeding to checkout!");
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
            <p>Category: {product.category}</p>
            <p>Stock: {product.stock}</p>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Quantity: </span>
              <Button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                style={{ margin: "0 10px" }}
              >
                -
              </Button>
              <span>{quantity}</span>
              <Button
                onClick={incrementQuantity}
                // disabled={quantity >= product.stock}
                style={{ margin: "0 10px" }}
              >
                +
              </Button>
            </div>
            <Button
              type="primary"
              onClick={handleAddToCart}
              style={{ marginRight: "10px" }}
            >
              Add to Cart
            </Button>
            <Button type="danger" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </Col>
        </Row>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProductDetails;
