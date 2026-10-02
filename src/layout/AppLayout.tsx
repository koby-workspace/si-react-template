import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  function handleToggle() {
    setCollapsed((previousCollapsed) => !previousCollapsed);
  }

  return (
    <Layout className="app-layout">
      <TopBar collapsed={collapsed} onToggle={handleToggle} />
      <Layout className="app-body">
        <SideMenu collapsed={collapsed} />
        <Layout.Content className="app-content">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
