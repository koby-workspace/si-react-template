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
  return (
    <div style={{ height: "100%", minHeight: 0 }}>
      <AgGridReact
        modules={modules}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={({ data }) => data.id}
        pagination
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50]}
      />
    </div>
  );
}

export default UsersPage;
