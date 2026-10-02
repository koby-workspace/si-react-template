import { useState } from "react";
import { Empty } from "antd";
import type { ThemeName } from "../../theme";
import UserSearchForm from "./components/UserSearchForm";
import type { UserSearchValues } from "./components/UserSearchForm";
import UserTable from "./components/UserTable";
import { mockUsers } from "./mockUsers";

type UserPageProps = {
  themeName: ThemeName;
  isDarkMode: boolean;
};

function UserPage({ themeName, isDarkMode }: UserPageProps) {
  const [appliedName, setAppliedName] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(appliedName),
  );

  function handleSearch(values: UserSearchValues) {
    setAppliedName(values.name.trim().toLowerCase());
  }

  return (
    <>
      <h1>사용자 관리</h1>
      <UserSearchForm onSearch={handleSearch} />
      <p>이름을 입력한 뒤 검색 버튼이나 Enter로 검색하세요.</p>
      {filteredUsers.length === 0 ? (
        <Empty description="검색 결과가 없습니다." />
      ) : (
        <UserTable
          users={filteredUsers}
          themeName={themeName}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
}

export default UserPage;
