import { useState } from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";

type AppLayoutProps = {
  isDarkMode: boolean;
  onThemeChange: (checked: boolean) => void;
};

function AppLayout({ isDarkMode, onThemeChange }: AppLayoutProps) {
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  function handleToggle() {
    setCollapsed((previousCollapsed) => !previousCollapsed);
  }

  return (
    <Layout className="app-layout" style={{ color: token.colorText }}>
      <TopBar
        collapsed={collapsed}
        onToggle={handleToggle}
        isDarkMode={isDarkMode}
        onThemeChange={onThemeChange}
      />
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
