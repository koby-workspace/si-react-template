import { Card } from "antd";
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

const rowData = [
  {
    id: "1",
    loginId: "admin",
    name: "관리자",
    email: "admin@example.com",
    role: "관리자",
    status: "사용",
    createdAt: "2026-09-01",
  },
  {
    id: "2",
    loginId: "hong",
    name: "홍길동",
    email: "hong@example.com",
    role: "일반 사용자",
    status: "사용",
    createdAt: "2026-09-10",
  },
  {
    id: "3",
    loginId: "kim",
    name: "김철수",
    email: "kim@example.com",
    role: "일반 사용자",
    status: "미사용",
    createdAt: "2026-09-15",
  },
];

function UsersPage() {
  return (
    <>
      <h1>사용자 관리</h1>
      <Card>
        <div style={{ height: 500 }}>
          <AgGridReact
            modules={modules}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={({ data }) => data.id}
            pagination
            paginationPageSize={10}
          />
        </div>
      </Card>
    </>
  );
}

export default UsersPage;
