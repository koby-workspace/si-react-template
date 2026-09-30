import { Layout } from "antd";

type SideMenuProps = {
  collapsed: boolean;
};

function SideMenu({ collapsed }: SideMenuProps) {
  return (
    <Layout.Sider
      id="app-side-menu"
      className="app-left"
      width={208}
      collapsedWidth={0}
      collapsed={collapsed}
      trigger={null}
      theme="light"
    >
      {!collapsed && <div className="app-left-content">Left 영역</div>}
    </Layout.Sider>
  );
}

export default SideMenu;
