import React from "react";
import { Button, Row, Typography, message } from "antd";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";

const { Title, Paragraph } = Typography;

function RemoveProductDialog({ setOpenRemoveModal, setProduct, product }) {
  const handleConfirm = async () => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/product/${product._id}`,
        { ...product, stock: "Discontinued" }
      );
      setProduct(response.data);
      message.success("Product discontinued");
      setOpenRemoveModal(false);
    } catch (error) {
      message.error("Failed to discontinue product");
    }
  };

  const handleCancel = () => {
    setOpenRemoveModal(false);
  };
  return (
    <div style={{ textAlign: "center" }}>
      <Title level={3}>Product Removal</Title>
      <Paragraph>
        Are you sure you discontinue this product? This action cannot be undone.
      </Paragraph>
      <Row
        style={{
          marginBottom: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button danger onClick={handleConfirm} style={{ margin: "0 10px" }}>
          Confirm
        </Button>
        <Button onClick={handleCancel} style={{ margin: "0 10px" }}>
          Cancel
        </Button>
      </Row>
    </div>
  );
}

export default RemoveProductDialog;
