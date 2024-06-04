import { Button, Form, Input, Row, Select, message } from "antd";
import axios from "axios";
import React from "react";
import { apiEndpoint } from "../../constants/constants";
import { categories, stockOptions } from "../../constants/constants";

const { TextArea } = Input;
const { Option } = Select;

function ProductEditForm({ setOpenEditModal, product, setProduct, form }) {
  const handleCancelClick = () => {
    setOpenEditModal(false);
  };
  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/product/${product._id}`,
        values
      );
      setProduct(response.data);
      message.success("Product details updated successfully");
      setOpenEditModal(false);
    } catch (error) {
      message.error("Failed to update product details");
    }
  };
  return (
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
        <Row
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button style={{ marginLeft: "10px" }} onClick={handleCancelClick}>
            Cancel
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
}

export default ProductEditForm;
