import { Button, Layout, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Link } from "react-router";

type TopBarProps = {
  collapsed: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  onThemeChange: (checked: boolean) => void;
};

function TopBar({ collapsed, onToggle, isDarkMode, onThemeChange }: TopBarProps) {
  const { token } = theme.useToken();
  const toggleLabel = collapsed ? "메뉴 펼치기" : "메뉴 접기";
  const themeToggleLabel = isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <Layout.Header
      className="app-top"
      style={{
        background: token.colorPrimaryBg,
        borderBottom: `1px solid ${token.colorPrimaryBorder}`,
      }}
    >
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
      <Button
        type="text"
        className="app-theme-toggle"
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        onClick={() => onThemeChange(!isDarkMode)}
        title={themeToggleLabel}
        aria-label={themeToggleLabel}
      />
    </Layout.Header>
  );
}

export default TopBar;
