import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";

const { Header, Sider, Content } = Layout;

function App() {
  const [showSidebar, setShowSidebar] = useState(true);

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
        {showSidebar && <Sider style={{ color: "#ffffff" }}>Left</Sider>}
        <Content style={{ padding: 24 }}>Main</Content>
      </Layout>
    </Layout>
  );
}

export default App;
