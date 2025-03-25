import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Typography, Spin, Divider, Button } from "antd";
import { apiEndpoint } from "../constants/constants";

const { Title, Text } = Typography;

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      const res = await fetch(`${apiEndpoint}/notification/${id}`);
      const data = await res.json();
      setNotification(data);
    };
    fetchNotification();
  }, [id]);

  if (!notification) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const { message, createdAt } = notification;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <Card
        title="Notification Details"
        extra={<Button onClick={() => navigate(-1)}>Back</Button>}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Title level={5}>Message</Title>
        <Text>{message}</Text>

        <Divider />

        <Title level={5}>Date</Title>
        <Text>{new Date(createdAt).toLocaleString()}</Text>

        <Divider />
      </Card>
    </div>
  );
};

export default NotificationDetail;
