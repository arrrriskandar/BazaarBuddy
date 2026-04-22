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
import { uploadFile } from "../../supabase/storage";

const { TextArea } = Input;
const { Option } = Select;

function ProductEditForm({ setOpenEditModal, product, setProduct, form }) {
  const { currentUser } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [removedImage, setRemovedImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const getImageSrc = () => {
    if (removedImage) return null;
    if (selectedFile) return previewUrl;
    if (product.images) {
      return `${product.images}?v=${product.imageVersion}`;
    }

    return null;
  };

  const handleCancelClick = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemovedImage(false);
    setOpenEditModal(false);
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
      const path = `${currentUser.supabaseId}/products/${product.photouuid}.jpg`;
      let photoUrl;
      if (selectedFile) {
        photoUrl = await uploadFile(selectedFile, path);
      }
      if (removedImage) {
        photoUrl = null;
      }
      const response = await axios.put(
        `${apiEndpoint}/product/${product._id}`,
        { ...values, images: photoUrl },
      );
      setProduct(response.data);
      message.success("Product details updated successfully");
      setSelectedFile(null);
      setPreviewUrl(null);
      setRemovedImage(false);
      setOpenEditModal(false);
    } catch (error) {
      message.error("Failed to update product details. Please try again.");
      console.error("Failed to update product details", error);
    }
  };

  const onFileSelect = (file) => {
    setSelectedFile(file);
    setRemovedImage(false);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemovedImage(true);
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
          {getImageSrc() ? (
            <Image src={getImageSrc()} preview={false} />
          ) : (
            <Button>Upload photo</Button>
          )}
        </FilePicker>

        {getImageSrc() && (
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
