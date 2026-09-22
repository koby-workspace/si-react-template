import { useEffect, useState } from "react";
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Badge, Button, ConfigProvider, Layout, Menu, message, theme, Tooltip } from "antd";
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
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = window.localStorage.getItem("si-react-template:theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
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

  useEffect(() => {
    window.localStorage.setItem("si-react-template:theme", darkMode ? "dark" : "light");
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const menuItems = buildMenuItems(menus);
  const colors = darkMode
    ? {
        header: "#111827",
        sider: "#111827",
        content: "#0f172a",
        border: "#263244",
        text: "#f8fafc",
        logo: "#818cf8",
        shadow: "0 2px 12px rgba(0, 0, 0, 0.35)",
      }
    : {
        header: "#ffffff",
        sider: "#ffffff",
        content: "#f5f7fb",
        border: "#e5e7eb",
        text: "#172033",
        logo: "#4f46e5",
        shadow: "0 2px 12px rgba(15, 23, 42, 0.08)",
      };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 8,
          colorBgLayout: colors.content,
          colorBgContainer: darkMode ? "#182235" : "#ffffff",
          colorBorderSecondary: colors.border,
        },
        components: {
          Button: { controlHeight: 34 },
          Card: { borderRadiusLG: 12 },
          Menu: {
            itemBorderRadius: 8,
            itemMarginInline: 10,
            itemMarginBlock: 4,
            darkItemBg: colors.sider,
            darkSubMenuItemBg: colors.sider,
            darkItemSelectedBg: "#4f46e5",
            itemSelectedBg: "#eef2ff",
            itemSelectedColor: "#4338ca",
          },
          Table: { borderRadius: 10 },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Header
        style={{
          color: colors.text,
          background: colors.header,
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
          display: "flex",
          alignItems: "center",
          gap: 16,
          height: 60,
          lineHeight: "60px",
          paddingInline: 16,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Button
          type="text"
          aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
          onClick={() => setShowSidebar((visible) => !visible)}
          icon={showSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        />
        <Link
          to="/dashboard"
          style={{ color: "inherit", display: "flex", alignItems: "center", gap: 10, fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 9,
              color: "#ffffff",
              background: colors.logo,
              fontSize: 12,
              boxShadow: `0 5px 12px ${darkMode ? "rgba(99, 102, 241, 0.28)" : "rgba(79, 70, 229, 0.22)"}`,
            }}
          >
            SI
          </span>
          <span>React Template</span>
        </Link>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <Tooltip title={darkMode ? "라이트 모드" : "다크 모드"}>
            <Button
              type="text"
              aria-label={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
              icon={darkMode
                ? <SunOutlined style={{ fontSize: 18 }} />
                : <MoonOutlined style={{ fontSize: 18 }} />}
              onClick={() => setDarkMode((enabled) => !enabled)}
            />
          </Tooltip>
          <Tooltip title="알림">
            <Badge count={unreadCount} size="small" overflowCount={99} style={{ boxShadow: "none" }}>
              <Button
                type="text"
                aria-label={`알림 ${unreadCount}건`}
                icon={<BellOutlined style={{ fontSize: 20 }} />}
                onClick={() => navigate("/notifications")}
              />
            </Badge>
          </Tooltip>
        </div>
      </Header>

      <Layout>
        {showSidebar && (
          <Sider
            width={232}
            theme={darkMode ? "dark" : "light"}
            style={{ background: colors.sider, borderInlineEnd: `1px solid ${colors.border}` }}
          >
            <Menu
              theme={darkMode ? "dark" : "light"}
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{ paddingTop: 12, borderInlineEnd: 0 }}
            />
          </Sider>
        )}
        <Content style={{ overflow: "hidden", display: "flex", flexDirection: "column", background: colors.content }}>
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
    </ConfigProvider>
  );
}

export default App;
