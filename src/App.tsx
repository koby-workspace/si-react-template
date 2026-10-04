import { useState } from "react";
import { App as AntApp, ConfigProvider } from "antd";
import { Route, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import AppAlertSetup from "./components/AppAlertSetup";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import UserPage from "./features/users/UserPage";
import { getAppTheme } from "./theme";
import type { ThemeName } from "./theme";
import "./styles.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeName, setThemeName] = useState<ThemeName>("classic-blue");
  const appTheme = getAppTheme(themeName, isDarkMode);
  const appStyle = {
    colorScheme: isDarkMode ? "dark" : "light",
    "--atelier-border": appTheme.token?.colorBorderSecondary,
    "--atelier-muted": appTheme.token?.colorTextSecondary,
    "--atelier-accent": appTheme.token?.colorPrimary,
  };

  return (
    <ConfigProvider
      theme={appTheme}
    >
      <AntApp
        className={`theme-${themeName}`}
        style={appStyle}
      >
        <AppAlertSetup />
        <Routes>
          <Route element={
            <AppLayout
              isDarkMode={isDarkMode}
              onThemeChange={setIsDarkMode}
              themeName={themeName}
              onThemeNameChange={setThemeName}
            />
          }>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UserPage themeName={themeName} isDarkMode={isDarkMode} />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
