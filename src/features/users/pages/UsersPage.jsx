import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Popconfirm, Select } from "antd";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import UserCreateModal from "../components/UserCreateModal.jsx";
import UserEditModal from "../components/UserEditModal.jsx";
import * as userApi from "../api/userApi.js";
import * as userGroupApi from "../../userGroups/api/userGroupApi.js";
import { statusOptions } from "../userOptions.js";
import { downloadTableCsv } from "../../../utils/downloadCsv.js";
import PageToolbar from "../../../components/layout/PageToolbar.jsx";

const modules = [AllCommunityModule];

const userColumnDefs = [
  { field: "loginId", headerName: "아이디" },
  { field: "name", headerName: "이름" },
  { field: "email", headerName: "이메일", flex: 2 },
  { field: "groupName", headerName: "사용자 그룹" },
  { field: "status", headerName: "상태" },
  { field: "createdAt", headerName: "등록일" },
];

const defaultColDef = {
  flex: 1,
  minWidth: 120,
  sortable: true,
  filter: true,
  resizable: true,
};

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [searchValues, setSearchValues] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const loadUsers = useCallback(
    async (params) => {
      try {
        const data = await userApi.getUsers(params);
        setUsers(data);
        setSelectedUsers([]);
      } catch {
        messageApi.error("사용자 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );

  useEffect(() => {
    // API 응답 이후에만 상태를 갱신하는 비동기 조회입니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers({});
  }, [loadUsers]);

  useEffect(() => {
    userGroupApi
      .getUserGroups()
      .then(setUserGroups)
      .catch(() => {
        messageApi.error("사용자 그룹 목록을 불러오지 못했습니다.");
      });
  }, [messageApi]);

  const groupOptions = useMemo(
    () => userGroups.map(({ id, name }) => ({ value: id, label: name })),
    [userGroups],
  );

  const columnDefs = useMemo(
    () => [
      ...userColumnDefs,
      {
        headerName: "관리",
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        sortable: false,
        filter: false,
        resizable: false,
        exportable: false,
        cellRenderer: ({ data }) => (
          <Button size="small" onClick={() => setEditingUser(data)}>
            수정
          </Button>
        ),
      },
    ],
    [],
  );

  const existingLoginIds = useMemo(
    () => new Set(users.map((user) => user.loginId.toLowerCase())),
    [users],
  );

  const handleSearch = async (values) => {
    setSearchValues(values);
    setLoading(true);
    await loadUsers(values);
  };

  const handleAdd = async (values) => {
    try {
      await userApi.createUser(values);
      setLoading(true);
      await loadUsers(searchValues);
      setIsAddModalOpen(false);
      messageApi.success("사용자를 추가했습니다.");
      return true;
    } catch (error) {
      messageApi.error(error.message || "사용자를 추가하지 못했습니다.");
      return false;
    }
  };

  const handleEdit = async (values) => {
    try {
      await userApi.updateUser(editingUser.id, values);
      setLoading(true);
      await loadUsers(searchValues);
      setEditingUser(null);
      messageApi.success("사용자 정보를 수정했습니다.");
      return true;
    } catch {
      messageApi.error("사용자 정보를 수정하지 못했습니다.");
      return false;
    }
  };

  const handleDeleteSelected = async () => {
    const ids = selectedUsers.map((user) => user.id);

    try {
      await userApi.deleteUsers(ids);
      setLoading(true);
      await loadUsers(searchValues);
      messageApi.success(`${ids.length}명의 사용자를 삭제했습니다.`);
    } catch {
      messageApi.error("사용자를 삭제하지 못했습니다.");
    }
  };

  const handleDownload = () => {
    downloadTableCsv({
      menuName: "사용자 관리",
      columns: columnDefs,
      rows: users,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        height: "100%",
        minHeight: 0,
      }}
    >
      {contextHolder}
      <PageToolbar
        onSearch={handleSearch}
        actions={[
          <Button
            key="download"
            icon={<DownloadOutlined />}
            disabled={users.length === 0}
            onClick={handleDownload}
          >
            엑셀 다운로드
          </Button>,
          <Button
            key="add"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalOpen(true)}
          >
            추가
          </Button>,
          <Popconfirm
            key="delete"
            title="사용자 일괄 삭제"
            description={`선택한 ${selectedUsers.length}명의 사용자를 삭제하시겠습니까?`}
            okText="삭제"
            cancelText="취소"
            okButtonProps={{ danger: true }}
            disabled={selectedUsers.length === 0}
            onConfirm={handleDeleteSelected}
          >
            <Button
              danger
              disabled={selectedUsers.length === 0}
              icon={<DeleteOutlined />}
            >
              삭제{selectedUsers.length > 0 && ` (${selectedUsers.length})`}
            </Button>
          </Popconfirm>,
        ]}
      >
        <Form.Item label="아이디" name="loginId">
          <Input allowClear />
        </Form.Item>
        <Form.Item label="이름" name="name">
          <Input allowClear />
        </Form.Item>
        <Form.Item label="이메일" name="email">
          <Input allowClear />
        </Form.Item>
        <Form.Item label="사용자 그룹" name="groupId">
          <Select allowClear style={{ width: 140 }} options={groupOptions} />
        </Form.Item>
        <Form.Item label="상태" name="status">
          <Select allowClear style={{ width: 120 }} options={statusOptions} />
        </Form.Item>
      </PageToolbar>

      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact
          modules={modules}
          rowData={users}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={({ data }) => data.id}
          rowSelection={{ mode: "multiRow", enableClickSelection: false }}
          selectionColumnDef={{ width: 48, resizable: false }}
          onSelectionChanged={({ api }) =>
            setSelectedUsers(api.getSelectedRows())
          }
          loading={loading}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>

      <UserCreateModal
        open={isAddModalOpen}
        existingLoginIds={existingLoginIds}
        groupOptions={groupOptions}
        onCreate={handleAdd}
        onCancel={() => setIsAddModalOpen(false)}
      />
      <UserEditModal
        user={editingUser}
        groupOptions={groupOptions}
        onSave={handleEdit}
        onCancel={() => setEditingUser(null)}
      />
    </div>
  );
}

export default UsersPage;
