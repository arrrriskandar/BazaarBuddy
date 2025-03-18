import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from "antd";
import axios from "axios";
import React, { useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import { categories, stockOptions } from "../../constants/constants";
import FilePicker from "../common/FilePicker";
import { useUser } from "../../contexts/UserContext";
import { uploadFile } from "../../firebase/storage";

const { TextArea } = Input;
const { Option } = Select;

function ProductEditForm({ setOpenEditModal, product, setProduct, form }) {
  const [productPhoto, setProductPhoto] = useState(product.images);
  const { currentUser } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleCancelClick = () => {
    setOpenEditModal(false);
    setProductPhoto(product.images);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };
  const handleFormSubmit = async (values) => {
    try {
      const path = `${currentUser._id}/products/${product.photouuid}/`;
      let photoUrl = productPhoto;
      if (selectedFile) {
        photoUrl = await uploadFile(selectedFile, path);
      }
      const response = await axios.put(
        `${apiEndpoint}/product/${product._id}`,
        { ...values, images: photoUrl }
      );
      setProduct(response.data);
      message.success("Product details updated successfully");
      setOpenEditModal(false);
    } catch (error) {
      message.error("Failed to update product details");
    }
  };

  const onFileSelect = (file) => {
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setProductPhoto(previewUrl);
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setProductPhoto("");
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FilePicker onFileSelect={onFileSelect}>
          {productPhoto ? (
            <Image src={productPhoto} preview={false} />
          ) : (
            <Button>Upload photo</Button>
          )}
        </FilePicker>

        {productPhoto && (
          <Button
            danger
            onClick={handleRemovePicture}
            style={{ display: "block", margin: "10px auto" }}
          >
            Remove
          </Button>
        )}
      </div>
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
    </>
  );
}

export default ProductEditForm;
