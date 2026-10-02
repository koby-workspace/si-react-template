import { Button, Layout, Select } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { themeOptions } from "../theme";
import type { ThemeName } from "../theme";

type TopBarProps = {
  collapsed: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  onThemeChange: (checked: boolean) => void;
  themeName: ThemeName;
  onThemeNameChange: (value: ThemeName) => void;
};

function TopBar({ collapsed, onToggle, isDarkMode, onThemeChange, themeName, onThemeNameChange }: TopBarProps) {
  const toggleLabel = collapsed ? "메뉴 펼치기" : "메뉴 접기";
  const themeToggleLabel = isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환";

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
      <Select<ThemeName>
        className="app-theme-select"
        aria-label="테마 선택"
        value={themeName}
        onChange={onThemeNameChange}
        options={themeOptions}
      />
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
