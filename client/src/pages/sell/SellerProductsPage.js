import React, { useEffect, useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Row, Col, Modal, Typography, Divider } from "antd";
import { useUser } from "../../contexts/UserContext";
import SellerProductDetails from "../../components/sell/SellerProductDetails";
import ProductCard from "../../components/product/ProductCard";
import ProductNameSearch from "../../components/product/ProductNameSearch";

const { Title } = Typography;

function SellerProducts() {
  const [products, setProducts] = useState({
    available: [],
    outOfStock: [],
    discontinued: [],
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const showModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderProductsSection = (title, products) => (
    <>
      <Title level={3}>{title}</Title>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <ProductCard product={product} showModal={showModal} />
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
      {products.available.length > 0 &&
        renderProductsSection("Available", products.available)}
      {products.outOfStock.length > 0 &&
        renderProductsSection("Out of Stock", products.outOfStock)}
      {products.discontinued.length > 0 &&
        renderProductsSection("Discontinued", products.discontinued)}

      {selectedProductId && (
        <Modal
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <SellerProductDetails productId={selectedProductId} />
        </Modal>
      )}
    </div>
  );
}

export default SellerProducts;
