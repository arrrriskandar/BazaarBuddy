import { Button, Form, Input, InputNumber, Row, Select, message } from "antd";
import axios from "axios";
import React from "react";
import { apiEndpoint } from "../../constants/constants";
import { categories, stockOptions } from "../../constants/constants";
import { useUser } from "../../contexts/UserContext";

const { TextArea } = Input;
const { Option } = Select;

function ProductAddForm({ setOpenModal, setProducts }) {
  const [form] = Form.useForm();
  const { currentUser } = useUser();
  const handleCancelClick = () => {
    setOpenModal(false);
  };
  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(`${apiEndpoint}/product`, {
        ...values,
        seller: currentUser._id,
      });
      if (response.data.stock === "Available") {
        setProducts((prevProducts) => ({
          ...prevProducts,
          available: [...prevProducts.available, response.data],
        }));
      } else {
        setProducts((prevProducts) => ({
          ...prevProducts,
          outOfStock: [...prevProducts.outOfStock, response.data],
        }));
      }
      form.resetFields();
      message.success("Product created successfully");
      setOpenModal(false);
    } catch (error) {
      message.error("Failed to create product");
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
      <Form.Item
        name="category"
        label="Category:"
        rules={[
          {
            required: true,
            message: "Please select a category!",
          },
        ]}
      >
        <Select>
          {categories.map((category) => (
            <Option value={category.value}>{category.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="stock"
        label="Stock:"
        rules={[
          {
            required: true,
            message: "Please select stock status!",
          },
        ]}
      >
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

export default ProductAddForm;
