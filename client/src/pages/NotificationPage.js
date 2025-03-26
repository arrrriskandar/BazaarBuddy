import { Card, List, Avatar, Typography, Button, Row, Col, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";

const { Text } = Typography;

const Notification = () => {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const navigate = useNavigate();

  if (notifications?.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Empty description="No notifications available" />
      </div>
    );
  }

  const handleNotificationClick = (notificationId, orderId, isRead) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
    navigate(`/notification/${orderId}`);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <BellOutlined />
              <h1 strong style={{ fontSize: "16px" }}>
                Notifications
              </h1>
            </div>
            <Button type="link" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>
        }
        variant={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <List
          itemLayout="vertical"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              style={{
                backgroundColor: item.isRead ? "#fff" : "#fff7f6",
                padding: "20px",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
              }}
              onClick={() =>
                handleNotificationClick(item._id, item.order, item.isRead)
              }
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
              </Row>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notification;
