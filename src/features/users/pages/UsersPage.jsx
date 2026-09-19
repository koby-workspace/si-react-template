import { useMemo, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select, Space } from "antd";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import UserCreateModal from "../components/UserCreateModal.jsx";
import { roleOptions, statusOptions } from "../userOptions.js";

const modules = [AllCommunityModule];

const columnDefs = [
  { field: "loginId", headerName: "아이디" },
  { field: "name", headerName: "이름" },
  { field: "email", headerName: "이메일", flex: 2 },
  { field: "role", headerName: "권한" },
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

const names = ["김민수", "이서준", "박지우", "최도윤", "정현우"];

const initialUsers = Array.from({ length: 45 }, (_, index) => {
  const userNumber = index + 1;

  return {
    id: String(userNumber),
    loginId:
      userNumber === 1 ? "admin" : `user${String(userNumber).padStart(2, "0")}`,
    name: userNumber === 1 ? "관리자" : names[index % names.length],
    email:
      userNumber === 1 ? "admin@example.com" : `user${userNumber}@example.com`,
    role: userNumber === 1 ? "관리자" : "일반 사용자",
    status: userNumber % 7 === 0 ? "미사용" : "사용",
    createdAt: `2026-09-${String((index % 20) + 1).padStart(2, "0")}`,
  };
});

function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchValues, setSearchValues] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const existingLoginIds = useMemo(
    () => new Set(users.map((user) => user.loginId.toLowerCase())),
    [users],
  );

  const filteredUsers = useMemo(() => {
    const normalizedLoginId = searchValues.loginId?.trim().toLowerCase();
    const normalizedName = searchValues.name?.trim().toLowerCase();
    const normalizedEmail = searchValues.email?.trim().toLowerCase();

    return users.filter((user) => {
      const matchesLoginId =
        !normalizedLoginId ||
        user.loginId.toLowerCase().includes(normalizedLoginId);
      const matchesName =
        !normalizedName || user.name.toLowerCase().includes(normalizedName);
      const matchesEmail =
        !normalizedEmail || user.email.toLowerCase().includes(normalizedEmail);
      const matchesRole = !searchValues.role || user.role === searchValues.role;
      const matchesStatus =
        !searchValues.status || user.status === searchValues.status;

      return (
        matchesLoginId &&
        matchesName &&
        matchesEmail &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [searchValues, users]);

  const handleAdd = (values) => {
    const nextId = String(
      Math.max(0, ...users.map(({ id }) => Number(id))) + 1,
    );

    setUsers((currentUsers) => [
      {
        id: nextId,
        loginId: values.loginId,
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
        createdAt: new Date().toLocaleDateString("sv-SE"),
      },
      ...currentUsers,
    ]);
    setIsAddModalOpen(false);
    messageApi.success("사용자를 추가했습니다.");
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
      <Form layout="inline" onFinish={setSearchValues}>
        <div
          style={{ display: "flex", alignItems: "flex-start", width: "100%" }}
        >
          <div
            style={{ display: "flex", flex: 1, flexWrap: "wrap", rowGap: 16 }}
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
            <Form.Item label="권한" name="role">
              <Select allowClear style={{ width: 120 }} options={roleOptions} />
            </Form.Item>
            <Form.Item label="상태" name="status">
              <Select
                allowClear
                style={{ width: 120 }}
                options={statusOptions}
              />
            </Form.Item>
          </div>
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
            >
              추가
            </Button>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              조회
            </Button>
          </Space>
        </div>
      </Form>

      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact
          modules={modules}
          rowData={filteredUsers}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={({ data }) => data.id}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>

      <UserCreateModal
        open={isAddModalOpen}
        existingLoginIds={existingLoginIds}
        onCreate={handleAdd}
        onCancel={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

export default UsersPage;
