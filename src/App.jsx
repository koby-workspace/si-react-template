import { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, message } from "antd";
import { Link, useLocation } from "react-router";
import AppRoutes from "./routes/AppRoutes.jsx";
import AppErrorBoundary from "./components/feedback/AppErrorBoundary.jsx";
import { getMenus, MENUS_CHANGED_EVENT } from "./features/menus/api/menuApi.js";

const { Header, Sider, Content } = Layout;

function buildMenuItems(menus, parentId = null) {
  return menus
    .filter((menu) => menu.enabled && menu.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((menu) => {
      const children = buildMenuItems(menus, menu.id);
      return {
        key: menu.path,
        label: (
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
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();

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
        <Content style={{ overflow: "hidden", padding: 24 }}>
          <AppErrorBoundary resetKey={location.pathname}>
            <AppRoutes />
          </AppErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
