import { useEffect, useRef, useState } from "react";
import { Button, Empty, Pagination, Spin } from "antd";
import PageHeader from "../../components/PageHeader";
import { appAlert } from "../../utils/appAlert";
import type { ThemeName } from "../../theme";
import UserSearchForm from "./components/UserSearchForm";
import type { UserSearchValues } from "./components/UserSearchForm";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";
import { createUser, deleteUsers, getUsers, updateUser } from "./api/userApi";
import type { User, UserFormValues, UserListQuery, UserListResult } from "./types";

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
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const savedActionRef = useRef<"등록" | "수정" | "삭제" | null>(null);
  const savingRef = useRef(false);
  const deletingRef = useRef(false);

  useEffect(() => {
    let ignore = false;
    const savedAction = savedActionRef.current;
    async function loadUsers() {
      try {
        const nextResult = await getUsers(query);
        if (!ignore) {
          setResult(nextResult);
        }
      } catch {
        if (!ignore) {
          setHasError(true);
          const completedAction = savedAction === "삭제" ? "삭제는" : `${savedAction}은`;
          appAlert.error(savedAction
              ? `${completedAction} 완료했지만 사용자 목록을 불러오지 못했습니다. 다시 검색하면 목록만 조회합니다.`
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

  function changeQuery(nextQuery: UserListQuery, savedAction: "등록" | "수정" | "삭제" | null = null) {
    if (
      nextQuery.name !== query.name || nextQuery.activeYn !== query.activeYn ||
      nextQuery.page !== query.page || savedAction
    ) {
      setSelectedUsers([]);
    }
    savedActionRef.current = savedAction;
    setIsLoading(true);
    setHasError(false);
    setQuery(nextQuery);
  }
  function handleSearch(values: UserSearchValues) {
    changeQuery({ ...query, ...values, page: 1 });
  }
  function handleReset() {
    setSelectedUsers([]);
    changeQuery({ ...query, name: "", activeYn: "", page: 1 });
  }
  async function handleSave(values: UserFormValues) {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    setSaveError("");
    const action = editingUser ? "수정" : "등록";
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
      } else {
        await createUser(values);
      }
      setIsFormModalOpen(false);
      await appAlert.success(`사용자를 ${action}했습니다. 목록에는 적용된 검색 조건에 맞는 사용자만 표시됩니다.`);
      changeQuery({ ...query, page: 1 }, action);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : `사용자 ${action}에 실패했습니다. 다시 저장해 주세요.`);
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  function handleEdit(user: User) {
    setSelectedUsers((current) => current.filter((selected) => selected.id !== user.id));
    setEditingUser(user);
    setSaveError("");
    setIsFormModalOpen(true);
  }

  function handleSelect(user: User, checked: boolean) {
    setSelectedUsers((current) => checked
      ? current.some((selected) => selected.id === user.id) ? current : [...current, user]
      : current.filter((selected) => selected.id !== user.id));
  }

  function handleSelectPage(users: User[], checked: boolean) {
    const pageIds = new Set(users.map((user) => user.id));
    setSelectedUsers((current) => {
      const otherPageUsers = current.filter((user) => !pageIds.has(user.id));
      if (!checked) return otherPageUsers;
      const currentPageUsers = users.filter((user) => !current.some((selected) => selected.id === user.id));
      return [...otherPageUsers, ...current.filter((user) => pageIds.has(user.id)), ...currentPageUsers];
    });
  }

  function handleDeleteSelected() {
    if (selectedUsers.length === 0 || deletingRef.current) return;
    const ids = selectedUsers.map((user) => user.id);
    const names = selectedUsers.map((user) => user.name).join(", ");
    const confirmModal = appAlert.confirm(
      `선택한 사용자 ${ids.length}명을 삭제할까요? (${names})`,
      async () => {
        if (deletingRef.current) return;
        deletingRef.current = true;
        setIsDeleting(true);
        try {
          await deleteUsers(ids);
          confirmModal.destroy();
          await appAlert.success(`선택한 사용자 ${ids.length}명을 삭제했습니다.`);
          const nextTotal = result.total - ids.length;
          const lastPage = Math.max(1, Math.ceil(nextTotal / PAGE_SIZE));
          changeQuery({ ...query, page: Math.min(query.page, lastPage) }, "삭제");
        } catch (error) {
          confirmModal.destroy();
          await appAlert.error(
            error instanceof Error ? error.message : "사용자 삭제에 실패했습니다. 다시 시도해 주세요.",
          );
        } finally {
          deletingRef.current = false;
          setIsDeleting(false);
        }
      },
      "삭제",
    );
  }

  return (
    <>
      <PageHeader
        title="사용자 관리"
        description={
          <>
            <p>
              이름과 활성 여부를 선택한 뒤 검색하세요. 초기화하면 전체 목록으로
              돌아갑니다.
            </p>
            <p>변경한 데이터는 메뉴 이동 시 유지되며, 새로고침하면 초기화됩니다.</p>
          </>
        }
      />
      <UserSearchForm onSearch={handleSearch} onReset={handleReset} />
      <div className="user-list-toolbar">
        <span>
          {!isLoading && !hasError && `조회 결과: 총 ${result.total}건 · 선택 ${selectedUsers.length}명`}
        </span>
        <div className="user-list-actions">
          <Button danger disabled={selectedUsers.length === 0 || isDeleting} onClick={handleDeleteSelected}>삭제</Button>
          <Button type="primary" onClick={() => {
            setSaveError("");
            setEditingUser(null);
            setIsFormModalOpen(true);
          }}>등록</Button>
        </div>
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
              onEdit={handleEdit}
              selectedUsers={selectedUsers}
              onSelect={handleSelect}
              onSelectPage={handleSelectPage}
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
      {isFormModalOpen && (
        <UserFormModal
          onCancel={() => { if (!savingRef.current) setIsFormModalOpen(false); }}
          onSave={handleSave}
          isSaving={isSaving}
          saveError={saveError}
          editingUser={editingUser}
        />
      )}
    </>
  );
}
export default UserPage;
