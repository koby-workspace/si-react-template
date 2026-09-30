import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router";

type SideMenuProps = {
  collapsed: boolean;
};

const menus = [
  { path: "/", label: "홈" },
  { path: "/dashboard", label: "대시보드" },
  { path: "/users", label: "사용자 관리" },
];

function SideMenu({ collapsed }: SideMenuProps) {
  const { pathname } = useLocation();
  const currentPath = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const selectedMenu = menus.find((menu) => menu.path === currentPath);
  const selectedKeys = selectedMenu ? [selectedMenu.path] : [];

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
            selectedKeys={selectedKeys}
            items={menus.map((menu) => ({
              key: menu.path,
              label: <Link to={menu.path}>{menu.label}</Link>,
            }))}
          />
        </div>
      )}
    </Layout.Sider>
  );
}

export default SideMenu;
