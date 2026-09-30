import type { ReactNode } from "react";
import { useState } from "react";
import { Layout } from "antd";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  function handleToggle() {
    setCollapsed((previousCollapsed) => !previousCollapsed);
  }

  return (
    <Layout className="app-layout">
      <TopBar collapsed={collapsed} onToggle={handleToggle} />
      <Layout className="app-body">
        <SideMenu collapsed={collapsed} />
        <Layout.Content className="app-content">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
