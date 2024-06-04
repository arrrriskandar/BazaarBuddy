import { Button, Form, Input, InputNumber, Row, Select, message } from "antd";
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
      <Form.Item
        name="name"
        label="Name:"
        rules={[
          {
            required: true,
            message: "Please enter product name!",
          },
        ]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item name="description" label="Description:">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price ($):"
        rules={[
          {
            required: true,
            type: "number",
            message: "Please enter product price!",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="category" label="Category:" required>
        <Select>
          {categories.map((category) => (
            <Option value={category.value}>{category.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="stock" label="Stock:" required>
        <Select>
          {stockOptions.map((option) => (
            <Option value={option.value}>{option.label}</Option>
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
