import { useState } from "react";
import { ConfigProvider } from "antd";
import { Route, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
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

  return (
    <ConfigProvider
      theme={getAppTheme(themeName, isDarkMode)}
    >
      <div style={{ colorScheme: isDarkMode ? "dark" : "light" }}>
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
      </div>
    </ConfigProvider>
  );
}

export default App;
