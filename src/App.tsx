import { useState } from "react";
import { ConfigProvider, theme } from "antd";
import { Route, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import UserPage from "./features/users/UserPage";
import "./styles.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ConfigProvider
      theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <div style={{ colorScheme: isDarkMode ? "dark" : "light" }}>
        <Routes>
          <Route element={<AppLayout isDarkMode={isDarkMode} onThemeChange={setIsDarkMode} />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UserPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
}

export default App;
