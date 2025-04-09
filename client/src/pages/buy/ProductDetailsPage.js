import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Button, Row, Col, Divider } from "antd";
import ProductInfo from "../../components/product/ProductInfo";
import { useCart } from "../../contexts/CartContext";
import ProductCard from "../../components/product/ProductCard";
import { getAverageRating } from "../../utils/ratingUtils";
import ReviewList from "../../components/review/ReviewList";
import ChatNowButton from "../../components/common/ChatNowButton";

function BrowseProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}/product/sellerproducts/${productId}`
        );
        const { product, products } = response.data;
        setProduct(product);
        setProducts(products);
      } catch (error) {
        message.error("Failed to retrieve product details. Please try again.");
        console.error("Failed to retrieve product details", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      message.success(`${product.name} added to cart!`);
    } catch (error) {
      message.error("Failed to add to cart. Please try again.");
      message.error("Failed to add to cart.", error);
    }
  };

  const handleBuyNow = () => {
    return { product, quantity };
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleProductCardClick = (clickedProduct) => {
    setProducts((prevProducts) => [
      ...prevProducts.filter((p) => p._id !== clickedProduct._id),
      product,
    ]);
    setProduct(clickedProduct);
    window.scrollTo(0, 0);
  };

  const averageSellerRating = product
    ? getAverageRating(product.seller.ratingCount, product.seller.ratingTotal)
    : 0;

  return (
    <div>
      {product ? (
        <>
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
                <Button
                  onClick={incrementQuantity}
                  style={{ margin: "0 10px" }}
                >
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
                <ChatNowButton receiverId={product.seller._id}></ChatNowButton>
                <Button
                  type="default"
                  onClick={handleAddToCart}
                  style={{ margin: "10px" }}
                >
                  Add to Cart
                </Button>
                <Link to="/buy/checkout" state={{ item: handleBuyNow() }}>
                  <Button type="primary">Buy Now</Button>
                </Link>
              </Row>
            </Col>
          </Row>
          <Divider />
          <h2>
            More from {product.seller.username}{" "}
            {product.seller.ratingCount > 0 ? (
              <span>
                | {averageSellerRating.toFixed(1)} ⭐ (
                {product.seller.ratingCount} reviews)
              </span>
            ) : (
              <span> | No reviews</span>
            )}
          </h2>
          <Row gutter={[16, 16]}>
            {products.map((relatedProduct) => (
              <Col xs={24} sm={12} md={8} lg={6} key={relatedProduct._id}>
                <div onClick={() => handleProductCardClick(relatedProduct)}>
                  <ProductCard product={relatedProduct} />
                </div>
              </Col>
            ))}
          </Row>
          <Divider />
          <ReviewList product={product} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BrowseProductDetails;
