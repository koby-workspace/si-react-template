import { Navigate, Route, Routes } from "react-router";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import UsersPage from "../features/users/pages/UsersPage.jsx";
import UserGroupsPage from "../features/userGroups/pages/UserGroupsPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/user-groups" element={<UserGroupsPage />} />
    </Routes>
  );
}

export default AppRoutes;
