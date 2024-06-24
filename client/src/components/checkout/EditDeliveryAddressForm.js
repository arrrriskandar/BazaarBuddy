import { Form, Button } from "antd";
import React from "react";
import AddressForm from "../common/AddressForm";

function EditDeliveryAddressForm({ setAddress, setUnitNumber, setVisible }) {
  const [form] = Form.useForm();

  const onFinish = async ({ address, unitNumber }) => {
    setAddress(address);
    setUnitNumber(unitNumber);
    setVisible(false);
  };

  const handleCancelClick = () => {
    setVisible(false);
  };
  return (
    <Form form={form} onFinish={onFinish}>
      <AddressForm form={form} />
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
      <Button style={{ marginLeft: "10px" }} onClick={handleCancelClick}>
        Cancel
      </Button>
    </Form>
  );
}

export default EditDeliveryAddressForm;
