import { Outlet, Route, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import UserPage from "./features/users/UserPage";
import "./styles.css";

function App() {
  return (
    <Routes>
      <Route
        element={
          <AppLayout>
            <Outlet />
          </AppLayout>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserPage />} />
      </Route>
    </Routes>
  );
}

export default App;
