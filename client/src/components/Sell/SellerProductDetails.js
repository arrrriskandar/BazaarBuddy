import React, { useEffect, useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Row, Col, Input, Form, Button, Select } from "antd";
import { Category, Stock } from "../../constants/eNums";

const { TextArea } = Input;
const { Option } = Select;

function SellerProductDetails(props) {
  const { productId } = props;
  const [product, setProduct] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        message.error("Failed to retrieve product details");
      }
    };
    fetchProduct();
  }, [productId]);

  const handleEditClick = () => {
    setIsEditing(true);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/product/${productId}`,
        values
      );
      setProduct(response.data);
      message.success("Product details updated successfully");
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update product details");
    }
  };

  return (
    <div>
      {product ? (
        <Row gutter={16} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <img
              src={product.images}
              alt={product.name}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={12}>
            {!isEditing ? (
              <>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <h2>${product.price}</h2>
                <p>Category: {Category[product.category]}</p>
                <p>Stock: {Stock[product.stock]}</p>
                <Button type="primary" onClick={handleEditClick}>
                  Edit
                </Button>
              </>
            ) : (
              <Form form={form} onFinish={handleFormSubmit} layout="vertical">
                <Form.Item name="name" label="Name">
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="price" label="Price">
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="category" label="Category">
                  <Select>
                    {Object.keys(Category).map((key) => (
                      <Option key={key} value={key}>
                        {Category[key]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="stock" label="Stock">
                  <Select>
                    {Object.keys(Stock).map((key) => (
                      <Option key={key} value={key}>
                        {Stock[key]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Col>
        </Row>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SellerProductDetails;
