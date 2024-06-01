import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { Col, Row, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/Product/ProductCard";

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
              <Link to={`/buy/product/${product._id}`}>
                <ProductCard product={product} averageRating={averageRating} />
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default BrowseProducts;
