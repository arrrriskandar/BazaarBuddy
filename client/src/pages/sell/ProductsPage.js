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
          apiEndpoint + `/product/myproducts/${currentUser._id}`,
          {
            params: searchParams,
          }
        );
        setProducts(response.data);
      } catch (error) {
        message.error("Failed to retrieve products, Please try again.");
        console.error("Failed to retrieve products", error);
      }
    };

    fetchProducts();
  }, [currentUser, searchParams]);

  const handleAdd = () => {
    setOpenModal(true);
  };

  const redirectToStripeOnboarding = async () => {
    try {
      const response = await axios.post(
        apiEndpoint + `/stripe/create-account-link`,
        { userId: currentUser._id, email: currentUser.email }
      );
      window.location.href = response.data.url;
    } catch (error) {
      message.error("Failed to initiate Stripe onboarding. Please try again.");
      console.error("Stripe onboarding error", error);
    }
  };

  if (!currentUser.stripeSellerId) {
    return (
      <div style={{ textAlign: "center", margin: "20px" }}>
        <h2>Complete Your Stripe Onboarding</h2>
        <p>
          You must create a Stripe account before you can list products for
          sale.
        </p>
        <Button type="primary" onClick={redirectToStripeOnboarding}>
          Create Stripe Account
        </Button>
      </div>
    );
  }

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
