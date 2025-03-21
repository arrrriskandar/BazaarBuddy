import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiEndpoint } from "../../constants/constants";
import { message, Row, Col, Modal, Button, Form, Divider } from "antd";
import ProductInfo from "../../components/product/ProductInfo";
import ProductEditForm from "../../components/product/ProductEditForm";
import RemoveProductDialog from "../../components/product/RemoveProductDialog";
import ReviewList from "../../components/review/ReviewList";

function SellerProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        message.error("Failed to retrieve product details: ", error.message);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleEdit = () => {
    setOpenEditModal(true);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  const handleRemove = () => {
    setOpenRemoveModal(true);
  };

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
              {product.stock !== "Discontinued" && (
                <Row
                  style={{
                    marginBottom: "20px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="primary"
                    onClick={handleEdit}
                    style={{ margin: "0 10px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    onClick={handleRemove}
                    style={{ margin: "0 10px" }}
                  >
                    Remove
                  </Button>
                </Row>
              )}
            </Col>
          </Row>
          <Modal
            open={openEditModal}
            footer={null}
            width={800}
            closable={false}
            centered={true}
          >
            <ProductEditForm
              setOpenEditModal={setOpenEditModal}
              product={product}
              setProduct={setProduct}
              form={form}
            />
          </Modal>
          <Modal
            open={openRemoveModal}
            footer={null}
            width={400}
            closable={false}
            centered={true}
          >
            <RemoveProductDialog
              setOpenRemoveModal={setOpenRemoveModal}
              setProduct={setProduct}
              product={product}
            />
          </Modal>
          <Divider />
          <ReviewList product={product} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SellerProductDetails;
