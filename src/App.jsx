import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router";
import AppRoutes from "./routes/AppRoutes.jsx";

const { Header, Sider, Content } = Layout;
const menuItems = [
  { key: "/dashboard", label: "대시보드" },
  { key: "/users", label: "사용자 관리" },
];

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
        Top
      </Header>

      <Layout>
        {showSidebar && (
          <Sider>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
            />
          </Sider>
        )}
        <Content style={{ overflow: "hidden", padding: 24 }}>
          <AppRoutes />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
