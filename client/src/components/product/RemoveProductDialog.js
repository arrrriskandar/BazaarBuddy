import React from "react";
import { Button, Row, Typography, message } from "antd";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

function RemoveProductDialog({ setOpenRemoveModal, setProduct, product }) {
  const navigate = useNavigate();
  const handleConfirm = async () => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/product/${product._id}`,
        { stock: "Discontinued" }
      );
      setProduct(response.data);
      message.success("Product discontinued");
      setOpenRemoveModal(false);
      navigate("/sell/product");
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
