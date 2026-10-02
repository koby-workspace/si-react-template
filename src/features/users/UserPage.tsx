import { useState } from "react";
import { Empty, Pagination } from "antd";
import type { ThemeName } from "../../theme";
import UserSearchForm from "./components/UserSearchForm";
import type { UserSearchValues } from "./components/UserSearchForm";
import UserTable from "./components/UserTable";
import { mockUsers } from "./mockUsers";

type UserPageProps = {
  themeName: ThemeName;
  isDarkMode: boolean;
};

const PAGE_SIZE = 10;

function UserPage({ themeName, isDarkMode }: UserPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
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

  const total = filteredUsers.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  function handleSearch(values: UserSearchValues) {
    setAppliedSearch({
      name: values.name.trim().toLowerCase(),
      activeYn: values.activeYn,
    });
    setCurrentPage(1);
  }

  function handleReset() {
    setAppliedSearch({ name: "", activeYn: "" });
    setCurrentPage(1);
  }

  return (
    <>
      <h1>사용자 관리</h1>
      <UserSearchForm onSearch={handleSearch} onReset={handleReset} />
      <p>
        이름과 활성 여부를 선택한 뒤 검색하세요. 초기화하면 전체 목록으로
        돌아갑니다.
      </p>
      <p>조회 결과: 총 {total}건</p>
      {total === 0 ? (
        <Empty description="검색 결과가 없습니다." />
      ) : (
        <UserTable
          users={pageUsers}
          themeName={themeName}
          isDarkMode={isDarkMode}
        />
      )}
      <Pagination
        style={{ marginTop: 16 }}
        current={currentPage}
        pageSize={PAGE_SIZE}
        total={total}
        showSizeChanger={false}
        onChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default UserPage;
