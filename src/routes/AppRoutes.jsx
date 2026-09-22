import { Navigate, Route, Routes } from "react-router";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import UsersPage from "../features/users/pages/UsersPage.jsx";
import UserHistoryPage from "../features/userHistory/pages/UserHistoryPage.jsx";
import UserGroupsPage from "../features/userGroups/pages/UserGroupsPage.jsx";
import MenusPage from "../features/menus/pages/MenusPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/user-history" element={<UserHistoryPage />} />
      <Route path="/user-groups" element={<UserGroupsPage />} />
      <Route path="/menus" element={<MenusPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
