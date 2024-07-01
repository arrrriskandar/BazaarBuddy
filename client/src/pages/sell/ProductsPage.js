import React, { useEffect, useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import axios from "axios";
import { message, Row, Divider, Button, Modal } from "antd";
import { useUser } from "../../contexts/UserContext";
import ProductNameSearch from "../../components/product/ProductNameSearch";
import { PlusOutlined } from "@ant-design/icons";
import ProductAddForm from "../../components/product/ProductAddForm";
import ProductsSection from "../../components/product/ProductsSection";

function SellerProducts() {
  const [products, setProducts] = useState({
    available: [],
    outOfStock: [],
    discontinued: [],
  });
  const { currentUser } = useUser();
  const [searchParams, setSearchParams] = useState({
    name: "",
  });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          apiEndpoint + `/product/sell/${currentUser._id}`,
          {
            params: searchParams,
          }
        );
        setProducts(response.data);
      } catch (error) {
        message.error("Failed to retrieve products");
      }
    };

    fetchProducts();
  }, [currentUser, searchParams]);

  const handleAdd = () => {
    setOpenModal(true);
  };

  return (
    <>
      <Row style={{ justifyContent: "end" }}>
        <Button
          icon={<PlusOutlined />}
          onClick={handleAdd}
          type="primary"
          style={{ marginLeft: 8 }}
        >
          Add Product
        </Button>
      </Row>
      <div style={{ padding: "20px" }}>
        <ProductNameSearch
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        <Divider />
        {products.available.length > 0 && (
          <ProductsSection title={"Available"} products={products.available} />
        )}
        {products.outOfStock.length > 0 && (
          <ProductsSection
            title={"Out of Stock"}
            products={products.outOfStock}
          />
        )}
        {products.discontinued.length > 0 && (
          <ProductsSection
            title={"Discontinued"}
            products={products.discontinued}
          />
        )}
      </div>
      <Modal
        open={openModal}
        footer={null}
        closable={false}
        centered={true}
        width={800}
      >
        <ProductAddForm setOpenModal={setOpenModal} setProducts={setProducts} />
      </Modal>
    </>
  );
}

export default SellerProducts;
