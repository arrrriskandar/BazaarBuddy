import React, { useEffect, useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import {
  message,
  Row,
  Col,
  Input,
  Form,
  Button,
  Select,
  Typography,
  Descriptions,
} from "antd";
import { categories, stockOptions } from "../../constants/constants";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

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
                <Title level={2}>{product.name}</Title>
                <Paragraph>{product.description}</Paragraph>
                <Title level={3}>${product.price}</Title>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Category">
                    {product.category}
                  </Descriptions.Item>
                  <Descriptions.Item label="Stock">
                    {product.stock}
                  </Descriptions.Item>
                </Descriptions>
                <Button
                  type="primary"
                  onClick={handleEditClick}
                  style={{ marginTop: "20px" }}
                >
                  Edit
                </Button>
              </>
            ) : (
              <Form form={form} onFinish={handleFormSubmit} layout="vertical">
                <Form.Item name="name" label="Name" required>
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="price" label="Price" required>
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="category" label="Category">
                  <Select>
                    {categories.map((category) => (
                      <Option key={category.value} value={category.stringValue}>
                        {category.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="stock" label="Stock">
                  <Select>
                    {stockOptions.map((option) => (
                      <Option key={option.value} value={option.stringValue}>
                        {option.label}
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
