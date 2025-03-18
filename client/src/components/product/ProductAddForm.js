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
import { useUser } from "../../contexts/UserContext";
import FilePicker from "../common/FilePicker";
import { uploadFile } from "../../firebase/storage";
import { v4 as uuidv4 } from "uuid";

const { TextArea } = Input;
const { Option } = Select;

function ProductAddForm({ setOpenModal, setProducts }) {
  const [form] = Form.useForm();
  const { currentUser } = useUser();
  const [productPhoto, setProductPhoto] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleCancelClick = () => {
    setOpenModal(false);
    form.resetFields();
    setProductPhoto("");
  };
  const handleFormSubmit = async (values) => {
    try {
      let photoUrl = null;
      let photouuid = uuidv4();

      // If a file is selected, upload it first
      if (selectedFile) {
        try {
          const path = `${currentUser._id}/products/${photouuid}`; // Define storage path
          photoUrl = await uploadFile(selectedFile, path); // Wait for upload
        } catch (uploadError) {
          message.error("Failed to upload image. Please try again.");
          return; // Stop execution if image upload fails
        }
      }

      // Now, post the product with the uploaded image URL
      const response = await axios.post(`${apiEndpoint}/product`, {
        ...values,
        seller: currentUser._id,
        images: photoUrl, // Now includes the image URL
        photouuid: photouuid,
      });

      // Update state based on stock status
      setProducts((prevProducts) => ({
        ...prevProducts,
        [response.data.stock === "Available" ? "available" : "outOfStock"]: [
          response.data,
          ...prevProducts[
            response.data.stock === "Available" ? "available" : "outOfStock"
          ],
        ],
      }));

      // Reset form and modal
      form.resetFields();
      setSelectedFile(null);
      setProductPhoto("");
      message.success("Product created successfully!");
      setOpenModal(false);
    } catch (error) {
      message.error("Failed to create product. Please try again.");
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
    </>
  );
}

export default ProductAddForm;
