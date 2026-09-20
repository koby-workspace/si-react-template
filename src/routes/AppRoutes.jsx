import { Navigate, Route, Routes } from "react-router";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import UsersPage from "../features/users/pages/UsersPage.jsx";
import UserGroupsPage from "../features/userGroups/pages/UserGroupsPage.jsx";
import MenusPage from "../features/menus/pages/MenusPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/user-groups" element={<UserGroupsPage />} />
      <Route path="/menus" element={<MenusPage />} />
    </Routes>
  );
}

export default AppRoutes;
