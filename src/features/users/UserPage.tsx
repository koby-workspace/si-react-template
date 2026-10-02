import { useMemo } from "react";
import { ClientSideRowModelModule } from "ag-grid-community";
import type { ColDef, GetRowIdParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { getGridTheme } from "../../theme";
import type { ThemeName } from "../../theme";
import { mockUsers } from "./mockUsers";
import type { User } from "./types";

const modules = [ClientSideRowModelModule];
const defaultColDef: ColDef<User> = {
  sortable: false,
  resizable: false,
  suppressMovable: true,
  cellDataType: false,
};

const columns: ColDef<User>[] = [
  { headerName: "ID", field: "id", minWidth: 130, flex: 1 },
  { headerName: "이름", field: "name", minWidth: 110, flex: 1 },
  { headerName: "이메일", field: "email", minWidth: 260, flex: 2 },
  {
    headerName: "부서",
    field: "department",
    minWidth: 120,
    flex: 1,
    valueFormatter: ({ value }) => value || "-",
  },
  {
    headerName: "활성 여부",
    field: "activeYn",
    minWidth: 100,
    flex: 1,
  },
];

function getRowId({ data }: GetRowIdParams<User>) {
  return data.id;
}

type UserPageProps = {
  themeName: ThemeName;
  isDarkMode: boolean;
};

function UserPage({ themeName, isDarkMode }: UserPageProps) {
  const gridTheme = useMemo(
    () => getGridTheme(themeName, isDarkMode),
    [themeName, isDarkMode],
  );

  return (
    <>
      <h1>사용자 관리</h1>
      <AgGridReact<User>
        modules={modules}
        theme={gridTheme}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        rowData={mockUsers}
        getRowId={getRowId}
        pagination={false}
        domLayout="autoHeight"
      />
    </>
  );
}

export default UserPage;
