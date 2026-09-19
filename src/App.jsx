import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import DashboardPage from "./pages/DashboardPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

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
        style={{ color: "#ffffff", display: "flex", alignItems: "center", gap: 16, paddingLeft: 12 }}
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
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
