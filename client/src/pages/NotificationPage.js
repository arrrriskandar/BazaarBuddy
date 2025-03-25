import {
  Card,
  Spin,
  Badge,
  List,
  Avatar,
  Typography,
  Button,
  Row,
  Col,
} from "antd";
import { apiEndpoint } from "../constants/constants";
import { useUser } from "../contexts/UserContext";
import { useState, useEffect } from "react";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const Notification = () => {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotification = async () => {
      if (!currentUser._id) return;
      const res = await fetch(
        `${apiEndpoint}/notification/user/${currentUser._id}`
      );
      const data = await res.json();
      setNotifications(data);
    };
    fetchNotification();
  }, [currentUser]);

  if (!notifications) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const { notifications: notifList, unreadCount } = notifications;

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <BellOutlined />
              <Text strong style={{ fontSize: "16px" }}>
                Notifications
              </Text>
              <Badge count={unreadCount} />
            </div>
            <Button type="link">Mark all as read</Button>
          </div>
        }
        variant={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <List
          itemLayout="vertical"
          dataSource={notifList}
          renderItem={(item) => (
            <List.Item
              style={{
                backgroundColor: item.isRead ? "#fff" : "#fff7f6",
                padding: "20px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Row gutter={16} align="middle">
                <Col>
                  <Avatar
                    shape="square"
                    size={64}
                    src={item.userId?.photoUrl || "/default-avatar.png"}
                  />
                </Col>
                <Col flex="auto">
                  <Text>
                    <Text strong>{item.message}</Text>
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </Col>
                <Col>
                  <Button
                    type="default"
                    size="small"
                    onClick={() => navigate(`/notifications/${item._id}`)}
                  >
                    View Details
                  </Button>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notification;
