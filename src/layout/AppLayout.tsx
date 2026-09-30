import type { ReactNode } from "react";
import { Layout } from "antd";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  return (
    <Layout className="app-layout">
      <TopBar />
      <Layout className="app-body">
        <SideMenu />
        <Layout.Content className="app-content">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
