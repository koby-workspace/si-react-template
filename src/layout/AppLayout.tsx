import { useState } from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";
import type { ThemeName } from "../theme";

type AppLayoutProps = {
  isDarkMode: boolean;
  onThemeChange: (checked: boolean) => void;
  themeName: ThemeName;
  onThemeNameChange: (value: ThemeName) => void;
};

function AppLayout({ isDarkMode, onThemeChange, themeName, onThemeNameChange }: AppLayoutProps) {
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
        themeName={themeName}
        onThemeNameChange={onThemeNameChange}
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
