import { useEffect, useState } from "react";
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Badge, Button, Layout, Menu, message, Tooltip } from "antd";
import { Link, useLocation, useNavigate } from "react-router";
import AppRoutes from "./routes/AppRoutes.jsx";
import AppErrorBoundary from "./components/feedback/AppErrorBoundary.jsx";
import CurrentMenuPath from "./components/layout/CurrentMenuPath.jsx";
import { getMenus, MENUS_CHANGED_EVENT } from "./features/menus/api/menuApi.js";
import { getUnreadNotificationCount, NOTIFICATIONS_CHANGED_EVENT } from "./features/notifications/api/notificationApi.js";

const { Header, Sider, Content } = Layout;

function buildMenuItems(menus, parentId = null) {
  return menus
    .filter((menu) => menu.enabled && menu.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((menu) => {
      const children = buildMenuItems(menus, menu.id);
      return {
        key: menu.path,
        label: children.length ? (
          menu.name
        ) : (
          <Link
            to={menu.path}
            style={{ color: "inherit" }}
            onClick={(event) => event.stopPropagation()}
          >
            {menu.name}
          </Link>
        ),
        children: children.length ? children : undefined,
      };
    });
}

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [menus, setMenus] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const syncMenus = async () => {
      try {
        const nextMenus = await getMenus();
        if (active) setMenus(nextMenus);
      } catch {
        if (active) messageApi.error("메뉴 목록을 불러오지 못했습니다.");
      }
    };

    syncMenus();
    window.addEventListener(MENUS_CHANGED_EVENT, syncMenus);
    return () => {
      active = false;
      window.removeEventListener(MENUS_CHANGED_EVENT, syncMenus);
    };
  }, [messageApi]);

  useEffect(() => {
    const syncUnreadCount = () => getUnreadNotificationCount().then(setUnreadCount);
    syncUnreadCount();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, syncUnreadCount);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, syncUnreadCount);
  }, []);

  const menuItems = buildMenuItems(menus);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Header
        style={{
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          gap: 16,
          paddingLeft: 12,
        }}
      >
        <Button
          type="primary"
          aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
          onClick={() => setShowSidebar((visible) => !visible)}
          icon={showSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        />
        <Link to="/dashboard" style={{ color: "inherit" }}>
          SI React Template
        </Link>
        <div style={{ marginLeft: "auto" }}>
          <Tooltip title="알림">
            <Badge count={unreadCount} size="small" overflowCount={99} style={{ boxShadow: "none" }}>
              <Button
                type="text"
                aria-label={`알림 ${unreadCount}건`}
                icon={<BellOutlined style={{ color: "#ffffff", fontSize: 20 }} />}
                onClick={() => navigate("/notifications")}
              />
            </Badge>
          </Tooltip>
        </div>
      </Header>

      <Layout>
        {showSidebar && (
          <Sider>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
            />
          </Sider>
        )}
        <Content style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, minHeight: 0, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <CurrentMenuPath menus={menus} pathname={location.pathname} />
            <div style={{ flex: 1, minHeight: 0 }}>
              <AppErrorBoundary resetKey={location.pathname}>
                <AppRoutes />
              </AppErrorBoundary>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
