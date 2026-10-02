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
  const [appliedSearch, setAppliedSearch] = useState<UserSearchValues>({
    name: "",
    activeYn: "",
  });

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(appliedSearch.name) &&
      (appliedSearch.activeYn === "" ||
        user.activeYn === appliedSearch.activeYn),
  );

  function handleSearch(values: UserSearchValues) {
    setAppliedSearch({
      name: values.name.trim().toLowerCase(),
      activeYn: values.activeYn,
    });
  }

  function handleReset() {
    setAppliedSearch({ name: "", activeYn: "" });
  }

  return (
    <>
      <h1>사용자 관리</h1>
      <UserSearchForm onSearch={handleSearch} onReset={handleReset} />
      <p>
        이름과 활성 여부를 선택한 뒤 검색하세요. 초기화하면 전체 목록으로
        돌아갑니다.
      </p>
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
