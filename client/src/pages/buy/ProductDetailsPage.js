import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Button, Row, Col, Divider } from "antd";
import ProductInfo from "../../components/product/ProductInfo";
import { useCart } from "../../contexts/CartContext";

function BrowseProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        message.error("Failed to retrieve product details: ", error.message);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity);
      message.success("Product added to cart!");
    } catch (error) {
      message.error("Failed to add to cart. Please try again", error.message);
    }
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
            <ProductInfo product={product} />
            <Divider />
            <Row
              style={{
                marginBottom: "20px",
                alignItems: "center",
                justifyContent: "center",
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
              <Button onClick={incrementQuantity} style={{ margin: "0 10px" }}>
                +
              </Button>
            </Row>
            <Row
              style={{
                marginBottom: "20px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                onClick={handleAddToCart}
                style={{ marginRight: "10px" }}
              >
                Add to Cart
              </Button>
              <Button type="default" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </Row>
          </Col>
        </Row>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BrowseProductDetails;
