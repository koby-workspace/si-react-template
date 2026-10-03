import { useEffect, useState } from "react";
import { Alert, Button, Empty, Pagination, Spin } from "antd";
import type { ThemeName } from "../../theme";
import UserSearchForm from "./components/UserSearchForm";
import type { UserSearchValues } from "./components/UserSearchForm";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";
import { getUsers } from "./api/userApi";
import type { UserListQuery, UserListResult } from "./types";

type UserPageProps = {
  themeName: ThemeName;
  isDarkMode: boolean;
};
const PAGE_SIZE = 10;

function UserPage({ themeName, isDarkMode }: UserPageProps) {
  const [query, setQuery] = useState<UserListQuery>({
    name: "",
    activeYn: "",
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [result, setResult] = useState<UserListResult>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadUsers() {
      try {
        const nextResult = await getUsers(query);
        if (!ignore) {
          setResult(nextResult);
        }
      } catch {
        if (!ignore) {
          setHasError(true);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    void loadUsers();
    return () => {
      ignore = true;
    };
  }, [query]);

  function changeQuery(nextQuery: UserListQuery) {
    setIsLoading(true);
    setHasError(false);
    setQuery(nextQuery);
  }
  function handleSearch(values: UserSearchValues) {
    changeQuery({ ...query, ...values, page: 1 });
  }
  function handleReset() {
    changeQuery({ ...query, name: "", activeYn: "", page: 1 });
  }

  return (
    <>
      <h1>사용자 관리</h1>
      <UserSearchForm onSearch={handleSearch} onReset={handleReset} />
      <p>
        이름과 활성 여부를 선택한 뒤 검색하세요. 초기화하면 전체 목록으로
        돌아갑니다.
      </p>
      <div className="user-list-toolbar">
        <span>
          {!isLoading && !hasError && `조회 결과: 총 ${result.total}건`}
        </span>
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          등록
        </Button>
      </div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <Spin size="small" /> 사용자 목록을 조회 중입니다.
        </div>
      ) : hasError ? (
        <Alert
          type="error"
          showIcon
          title="사용자 목록을 불러오지 못했습니다. 다시 검색해 주세요."
        />
      ) : (
        <>
          {result.total === 0 ? (
            <Empty description="검색 결과가 없습니다." />
          ) : (
            <UserTable
              users={result.items}
              themeName={themeName}
              isDarkMode={isDarkMode}
            />
          )}
          <Pagination
            style={{ marginTop: 16 }}
            current={query.page}
            pageSize={PAGE_SIZE}
            total={result.total}
            showSizeChanger={false}
            onChange={(page) => changeQuery({ ...query, page })}
          />
        </>
      )}
      {isCreateModalOpen && (
        <UserFormModal onCancel={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
export default UserPage;
