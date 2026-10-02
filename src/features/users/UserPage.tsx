import type { ThemeName } from "../../theme";
import UserTable from "./components/UserTable";
import { mockUsers } from "./mockUsers";

type UserPageProps = {
  themeName: ThemeName;
  isDarkMode: boolean;
};

function UserPage({ themeName, isDarkMode }: UserPageProps) {
  return (
    <>
      <h1>사용자 관리</h1>
      <UserTable
        users={mockUsers}
        themeName={themeName}
        isDarkMode={isDarkMode}
      />
    </>
  );
}

export default UserPage;
