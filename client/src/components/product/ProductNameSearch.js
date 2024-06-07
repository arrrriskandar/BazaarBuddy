import React from "react";
import { Row, Col, Input } from "antd";

const ProductNameSearch = ({
  searchParams,
  setSearchParams,
  setCurrentPage,
}) => {
  const handleInputChange = (e) => {
    setCurrentPage(1);
    setSearchParams((prevParams) => ({
      ...prevParams,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
      <Col span={24}>
        <Input
          placeholder="Search product"
          name="name"
          value={searchParams.name}
          onChange={handleInputChange}
        />
      </Col>
    </Row>
  );
};

export default ProductNameSearch;
