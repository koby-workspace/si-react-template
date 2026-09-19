import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

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

const names = ["김민준", "이서준", "박지훈", "최도윤", "정현우"];

const rowData = Array.from({ length: 45 }, (_, index) => {
  const userNumber = index + 1;

  return {
    id: String(userNumber),
    loginId: userNumber === 1 ? "admin" : `user${String(userNumber).padStart(2, "0")}`,
    name: userNumber === 1 ? "관리자" : names[index % names.length],
    email: userNumber === 1 ? "admin@example.com" : `user${userNumber}@example.com`,
    role: userNumber === 1 ? "관리자" : "일반 사용자",
    status: userNumber % 7 === 0 ? "미사용" : "사용",
    createdAt: `2026-09-${String((index % 20) + 1).padStart(2, "0")}`,
  };
});

function UsersPage() {
  const [filteredRowData, setFilteredRowData] = useState(rowData);

  const handleSearch = ({ loginId, name, email, role, status }) => {
    const normalizedLoginId = loginId?.trim().toLowerCase();
    const normalizedName = name?.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();

    setFilteredRowData(
      rowData.filter((user) => {
        const matchesLoginId =
          !normalizedLoginId || user.loginId.toLowerCase().includes(normalizedLoginId);
        const matchesName = !normalizedName || user.name.toLowerCase().includes(normalizedName);
        const matchesEmail = !normalizedEmail || user.email.toLowerCase().includes(normalizedEmail);
        const matchesRole = !role || user.role === role;
        const matchesStatus = !status || user.status === status;

        return matchesLoginId && matchesName && matchesEmail && matchesRole && matchesStatus;
      }),
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%", minHeight: 0 }}>
      <Form layout="inline" onFinish={handleSearch}>
        <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
          <div style={{ display: "flex", flex: 1, flexWrap: "wrap", rowGap: 16 }}>
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
              <Select
                allowClear
                style={{ width: 120 }}
                options={[
                  { value: "관리자", label: "관리자" },
                  { value: "일반 사용자", label: "일반 사용자" },
                ]}
              />
            </Form.Item>
            <Form.Item label="상태" name="status">
              <Select
                allowClear
                style={{ width: 120 }}
                options={[
                  { value: "사용", label: "사용" },
                  { value: "미사용", label: "미사용" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item style={{ flexShrink: 0, marginRight: 0 }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              조회
            </Button>
          </Form.Item>
        </div>
      </Form>

      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact
          modules={modules}
          rowData={filteredRowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={({ data }) => data.id}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>
    </div>
  );
}

export default UsersPage;
