import React, { useEffect, useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Row, Col, Modal } from "antd";
import { useUser } from "../../contexts/UserContext";
import SellerProductDetails from "../../components/sell/SellerProductDetails";
import ProductCard from "../../components/product/ProductCard";

function SellerProducts() {
  const [products, setProducts] = useState({
    available: [],
    outOfStock: [],
    discontinued: [],
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentUser } = useUser();
  const [searchName, setSearchName] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          apiEndpoint + `/product/sell/${currentUser._id}`,
          {
            params: { name: searchName },
          }
        );
        console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        message.error("Failed to retrieve products");
      }
    };

    fetchProducts();
  }, [currentUser._id]);

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

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {products.available.map((product) => {
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <ProductCard product={product} showModal={showModal} />
            </Col>
          );
        })}
      </Row>
      <Row gutter={[16, 16]}>
        {products.outOfStock.map((product) => {
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <ProductCard product={product} showModal={showModal} />
            </Col>
          );
        })}
      </Row>
      <Row gutter={[16, 16]}>
        {products.discontinued.map((product) => {
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <ProductCard product={product} showModal={showModal} />
            </Col>
          );
        })}
      </Row>

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
