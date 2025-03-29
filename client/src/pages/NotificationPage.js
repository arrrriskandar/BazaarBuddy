import { Card, List, Avatar, Typography, Button, Row, Col, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { useUser } from "../contexts/UserContext";

const { Text } = Typography;

const Notification = () => {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  if (notifications?.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Empty description="No notifications available" />
      </div>
    );
  }

  const handleNotificationClick = (
    notificationId,
    order,
    isRead,
    orderCompleted
  ) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
    if (orderCompleted) {
      navigate(`/review/order/${order._id}`);
    } else {
      const { seller } = order;
      if (seller._id === currentUser._id) {
        navigate(`/sell/order?orderId=${order._id}`);
      } else {
        navigate(`/buy/order?orderId=${order._id}`);
      }
    }
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
                handleNotificationClick(
                  item._id,
                  item.order,
                  item.isRead,
                  item.orderCompleted
                )
              }
            >
              <Row gutter={16} align="middle">
                <Col>
                  <Avatar
                    shape="square"
                    size={80}
                    src={
                      item.order?.seller?._id === currentUser._id
                        ? item.order?.user?.photoUrl || "/default-avatar.png"
                        : item.order?.seller?.photoUrl || "/default-avatar.png"
                    }
                    style={{
                      margin: "20px auto",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
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
