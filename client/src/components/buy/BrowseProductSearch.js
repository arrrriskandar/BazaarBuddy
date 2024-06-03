import React from "react";
import { Row, Col, Select } from "antd";
import ProductNameSearch from "../product/ProductNameSearch";

const { Option } = Select;

const BrowseProductSearch = ({
  searchParams,
  setSearchParams,
  setCurrentPage,
}) => {
  const handleSelectChange = (value, name) => {
    setCurrentPage(1);
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <ProductNameSearch
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setCurrentPage={setCurrentPage}
      />
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <label>Category:</label>
          <Select
            placeholder="Select category"
            value={searchParams.category}
            onChange={(value) => handleSelectChange(value, "category")}
            style={{ width: "100%" }}
          >
            <Option value="">All Categories</Option>
            <Option value="Food and Beverages">Food and Beverages</Option>
            <Option value="Fashion">Fashion</Option>
            <Option value="Beauty">Beauty</Option>
            <Option value="Home and Living">Home and Living</Option>
            <Option value="Sports and Wellness">Sports and Wellness</Option>
            <Option value="Electronics">Electronics</Option>
            <Option value="Others">Others</Option>
          </Select>
        </Col>
        <Col span={8}>
          <label htmlFor="sortSelect">Sort by:</label>
          <Select
            placeholder="Sort by"
            value={searchParams.sortCriteria}
            onChange={(value) => handleSelectChange(value, "sortCriteria")}
            style={{ width: "100%" }}
          >
            <Option value="ratingAveragedesc">Rating (High-Low)</Option>
            <Option value="ratingAverageasc">Rating (Low-High)</Option>
            <Option value="priceasc">Price (Low-High)</Option>
            <Option value="pricedesc">Price (High-Low)</Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default BrowseProductSearch;
