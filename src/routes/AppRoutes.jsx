import { Navigate, Route, Routes } from "react-router";
import DashboardPage from "../pages/DashboardPage.jsx";
import UsersPage from "../pages/UsersPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
    </Routes>
  );
}

export default AppRoutes;
