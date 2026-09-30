import { Layout, Menu } from "antd";
import { Link } from "react-router";

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
      {!collapsed && (
        <div className="app-left-content">
          <Menu
            mode="inline"
            selectable={false}
            items={[
              { key: "home", label: <Link to="/">홈</Link> },
              { key: "dashboard", label: <Link to="/dashboard">대시보드</Link> },
              { key: "users", label: <Link to="/users">사용자 관리</Link> },
            ]}
          />
        </div>
      )}
    </Layout.Sider>
  );
}

export default SideMenu;
