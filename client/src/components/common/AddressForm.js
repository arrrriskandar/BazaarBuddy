import React, { useState } from "react";
import { Form, AutoComplete, Input, message } from "antd";
import { getSingaporeAddress } from "../../oneMap/addressLookup";

const AddressForm = ({ form }) => {
  const [addressOptions, setAddressOptions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const validateAddress = (_, value) => {
    if (!selectedAddress) {
      return Promise.reject(
        "Please select a valid address from the dropdown list!"
      );
    }
    return Promise.resolve();
  };

  const validateUnitNumber = (_, value) => {
    const unitNumberRegex = /^#\d{2}-\d{3}$/; // Example format: #12-345
    if (!value || value.match(unitNumberRegex)) {
      return Promise.resolve();
    }
    return Promise.reject("Unit number must be in the format #XX-XXX!");
  };

  const handleAddressSearch = async (value) => {
    if (value) {
      try {
        const addresses = await getSingaporeAddress(value);
        setAddressOptions(
          addresses.map((addr) => ({
            value: addr.ADDRESS,
            label: addr.ADDRESS,
          }))
        );
      } catch (error) {
        console.error(error);
        message.error("Error fetching address");
      }
    } else {
      setAddressOptions([]);
    }
  };

  const handleAddressSelect = (value) => {
    setSelectedAddress(value);
  };

  const handleAddressChange = (value) => {
    if (!addressOptions.some((option) => option.value === value)) {
      setSelectedAddress(null);
    }
  };

  return (
    <>
      <Form.Item name="address" rules={[{ validator: validateAddress }]}>
        <AutoComplete
          options={addressOptions}
          onSearch={handleAddressSearch}
          onSelect={handleAddressSelect}
          onChange={handleAddressChange}
          placeholder="Search your address"
          style={{ textAlign: "left" }}
        />
      </Form.Item>
      <Form.Item name="unitNumber" rules={[{ validator: validateUnitNumber }]}>
        <Input placeholder="Unit Number" />
      </Form.Item>
    </>
  );
};

export default AddressForm;
