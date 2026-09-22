import { Button, List, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../api/notificationApi.js";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const load = () => getNotifications().then(setNotifications);

  useEffect(() => {
    load();
  }, []);

  const openNotification = async (notification) => {
    await markNotificationAsRead(notification.id);
    navigate(notification.targetPath);
  };

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();
    await load();
  };

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={notifications.every(({ read }) => read)} onClick={markAllAsRead}>모두 읽음</Button>
      </div>
      <List
        bordered
        dataSource={notifications}
        locale={{ emptyText: "알림이 없습니다." }}
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer", background: item.read ? undefined : "#f0f7ff" }} onClick={() => openNotification(item)}>
            <List.Item.Meta
              title={<Space><Tag>{item.source}</Tag><span>{item.title}</span>{!item.read && <Tag color="blue">새 알림</Tag>}</Space>}
              description={item.createdAt}
            />
          </List.Item>
        )}
      />
    </Space>
  );
}

export default NotificationsPage;
