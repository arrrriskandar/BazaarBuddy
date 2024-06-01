import React, { useEffect, useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Card, Row, Col, Rate, Modal } from "antd";
import { useUser } from "../../contexts/UserContext";
import SellerProductDetails from "../../components/Sell/SellerProductDetails";

const { Meta } = Card;

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiEndpoint + "/product", {
          params: { seller: currentUser._id, retrieveMyProducts: true },
        });
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
        {products.map((product) => {
          const averageRating = product.ratingCount
            ? product.ratingSum / product.ratingCount
            : 0;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.images} />}
                onClick={() => showModal(product._id)}
              >
                <Meta title={product.name} description={`$${product.price}`} />
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <Rate disabled defaultValue={averageRating} />
                  <div>{averageRating.toFixed(1)} / 5</div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {selectedProductId && (
        <Modal
          title="Product Details"
          visible={isModalVisible}
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
