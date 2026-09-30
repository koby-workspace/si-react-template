import { Button, Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Link } from "react-router";

type TopBarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

function TopBar({ collapsed, onToggle }: TopBarProps) {
  const toggleLabel = collapsed ? "메뉴 펼치기" : "메뉴 접기";

  return (
    <Layout.Header className="app-top">
      <Button
        type="text"
        className="app-menu-toggle"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        title={toggleLabel}
        aria-label={toggleLabel}
        aria-controls="app-side-menu"
        aria-expanded={!collapsed}
      />
      <Link className="app-system-name" to="/">SI React Template</Link>
    </Layout.Header>
  );
}

export default TopBar;
