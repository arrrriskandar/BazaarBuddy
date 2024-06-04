import React, { useEffect, useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Row, Col, Typography, Divider } from "antd";
import { useUser } from "../../contexts/UserContext";
import ProductCard from "../../components/product/ProductCard";
import ProductNameSearch from "../../components/product/ProductNameSearch";
import { Link } from "react-router-dom";

const { Title } = Typography;

function SellerProducts() {
  const [products, setProducts] = useState({
    available: [],
    outOfStock: [],
    discontinued: [],
  });
  const { currentUser } = useUser();
  const [searchParams, setSearchParams] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          apiEndpoint + `/product/sell/${currentUser._id}`,
          {
            params: searchParams,
          }
        );
        setProducts(response.data);
      } catch (error) {
        message.error("Failed to retrieve products");
      }
    };

    fetchProducts();
  }, [currentUser._id, searchParams]);

  const renderProductsSection = (title, products) => (
    <>
      <Title level={3}>{title}</Title>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Link to={`/sell/product/${product._id}`}>
              <ProductCard product={product} />
            </Link>
          </Col>
        ))}
      </Row>
      <Divider />
    </>
  );

  return (
    <div style={{ padding: "20px" }}>
      <ProductNameSearch
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <Divider />
      {products.available.length > 0 &&
        renderProductsSection("Available", products.available)}
      {products.outOfStock.length > 0 &&
        renderProductsSection("Out of Stock", products.outOfStock)}
      {products.discontinued.length > 0 &&
        renderProductsSection("Discontinued", products.discontinued)}
    </div>
  );
}

export default SellerProducts;
