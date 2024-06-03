import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { Col, Row, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { useUser } from "../../contexts/UserContext";
import BrowseProductSearch from "../../components/buy/BrowseProductSearch";

function BrowseProducts() {
  const { currentUser } = useUser();
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "",
    sortCriteria: "ratingAveragedesc",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          apiEndpoint + `/product/buy/${currentUser._id}`,
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

  return (
    <div style={{ padding: "20px" }}>
      <BrowseProductSearch
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <Row gutter={[16, 16]}></Row>
      <Row gutter={[16, 16]}>
        {products.map((product) => {
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Link to={`/buy/product/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default BrowseProducts;
