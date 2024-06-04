import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiEndpoint } from "../../constants/constants";
import { message, Row, Col, Modal, Button, Form } from "antd";
import ProductInfo from "../../components/product/ProductInfo";
import ProductEditForm from "../../components/product/ProductEditForm";

function SellerProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [openModel, setOpenModel] = useState(false);
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
    setOpenModel(true);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  const handleOk = () => {
    setOpenModel(false);
  };

  const handleCancel = () => {
    setOpenModel(false);
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
              <Button onClick={handleEdit} style={{ margin: "0 10px" }}>
                Edit
              </Button>
            </Col>
          </Row>
          <Modal
            open={openModel}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={800}
          >
            <ProductEditForm
              setOpenModal={setOpenModel}
              product={product}
              setProduct={setProduct}
              form={form}
            />
          </Modal>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SellerProductDetails;
