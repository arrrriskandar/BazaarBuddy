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
      const addResponse = await axios.post(`${apiEndpoint}/product`, {
        ...values,
        seller: currentUser._id,
      });
      const path = `${currentUser._id}/${addResponse.data._id}/`;
      let photoUrl = null;
      if (selectedFile) {
        try {
          // Attempt to upload the file
          photoUrl = await uploadFile(selectedFile, path);
        } catch (uploadError) {
          // If upload fails, cancel product creation and show error
          message.error("Failed to create product. Please try again.");
          setOpenModal(false);
          return; // Exit early to prevent further code execution
        }
      }
      const updateResponse = await axios.post(`${apiEndpoint}/product`, {
        ...values,
        seller: currentUser._id,
        images: photoUrl,
      });
      if (updateResponse.data.stock === "Available") {
        setProducts((prevProducts) => ({
          ...prevProducts,
          available: [...prevProducts.available, updateResponse.data],
        }));
      } else {
        setProducts((prevProducts) => ({
          ...prevProducts,
          outOfStock: [...prevProducts.outOfStock, updateResponse.data],
        }));
      }
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
