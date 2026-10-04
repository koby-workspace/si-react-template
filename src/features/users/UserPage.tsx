import { useEffect, useRef, useState } from "react";
import { Button, Empty, Pagination, Spin } from "antd";
import { appAlert } from "../../utils/appAlert";
import type { ThemeName } from "../../theme";
import UserSearchForm from "./components/UserSearchForm";
import type { UserSearchValues } from "./components/UserSearchForm";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";
import { createUser, getUsers } from "./api/userApi";
import type { UserFormValues, UserListQuery, UserListResult } from "./types";

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const isQueryAfterCreateRef = useRef(false);
  const savingRef = useRef(false);

  useEffect(() => {
    let ignore = false;
    const isQueryAfterCreate = isQueryAfterCreateRef.current;
    async function loadUsers() {
      try {
        const nextResult = await getUsers(query);
        if (!ignore) {
          setResult(nextResult);
        }
      } catch {
        if (!ignore) {
          setHasError(true);
          appAlert.error(isQueryAfterCreate
              ? "등록은 완료했지만 사용자 목록을 불러오지 못했습니다. 다시 검색하면 목록만 조회합니다."
              : "사용자 목록을 불러오지 못했습니다. 다시 검색해 주세요.");
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

  function changeQuery(nextQuery: UserListQuery, isAfterCreate = false) {
    isQueryAfterCreateRef.current = isAfterCreate;
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
  async function handleCreate(values: UserFormValues) {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    setSaveError("");
    try {
      await createUser(values);
      setIsCreateModalOpen(false);
      await appAlert.success("사용자를 등록했습니다. 목록에는 적용된 검색 조건에 맞는 사용자만 표시됩니다.");
      changeQuery({ ...query, page: 1 }, true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "사용자 등록에 실패했습니다. 다시 저장해 주세요.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  return (
    <>
      <h1>사용자 관리</h1>
      <UserSearchForm onSearch={handleSearch} onReset={handleReset} />
      <p>
        이름과 활성 여부를 선택한 뒤 검색하세요. 초기화하면 전체 목록으로
        돌아갑니다.
      </p>
      <p>변경한 데이터는 메뉴 이동 시 유지되며, 새로고침하면 초기화됩니다.</p>
      <div className="user-list-toolbar">
        <span>
          {!isLoading && !hasError && `조회 결과: 총 ${result.total}건`}
        </span>
        <Button type="primary" onClick={() => {
          setSaveError("");
          setIsCreateModalOpen(true);
        }}>
          등록
        </Button>
      </div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <Spin size="small" /> 사용자 목록을 조회 중입니다.
        </div>
      ) : hasError ? (
        <Empty description="조회 결과를 표시할 수 없습니다." />
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
        <UserFormModal
          onCancel={() => { if (!savingRef.current) setIsCreateModalOpen(false); }}
          onSave={handleCreate}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}
    </>
  );
}
export default UserPage;
