import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { Col, Row, message, Pagination, Divider } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { useUser } from "../../contexts/UserContext";
import BrowseProductSearch from "../../components/product/BrowseProductSearch";

function BrowseProducts() {
  const { currentUser } = useUser();
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "",
    sortCriteria: "ratingAveragedesc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser?._id) return;
      try {
        const response = await axios.get(
          `${apiEndpoint}/product/buy/${currentUser._id}`,
          {
            params: {
              ...searchParams,
              page: currentPage,
              limit: pageSize,
            },
          }
        );
        setProducts(response.data.products);
        setTotalItems(response.data.total);
      } catch (error) {
        message.error("Failed to retrieve products. Please try again.");
        message.error("Failed to retrieve products", error);
      }
    };

    fetchProducts();
  }, [currentUser, searchParams, currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div style={{ padding: "20px" }}></div>
      <BrowseProductSearch
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setCurrentPage={setCurrentPage}
      />
      <Divider />
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Link to={`/buy/product/${product._id}`}>
              <ProductCard product={product} />
            </Link>
          </Col>
        ))}
      </Row>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
          showTotal={(total) =>
            `Page ${currentPage} / ${Math.ceil(total / pageSize)}`
          }
        />
      </div>
    </>
  );
}

export default BrowseProducts;
