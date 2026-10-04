import { useMemo } from "react";
import { Button } from "antd";
import { ClientSideRowModelModule } from "ag-grid-community";
import type { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { getGridTheme } from "../../../theme";
import type { ThemeName } from "../../../theme";
import type { User } from "../types";

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

type UserTableProps = {
  users: User[];
  themeName: ThemeName;
  isDarkMode: boolean;
  onEdit: (user: User) => void;
};

function UserTable({ users, themeName, isDarkMode, onEdit }: UserTableProps) {
  const columnDefs = useMemo<ColDef<User>[]>(() => [
    ...columns,
    {
      headerName: "작업",
      minWidth: 100,
      width: 100,
      cellRenderer: ({ data }: ICellRendererParams<User>) => data ? (
        <Button size="small" aria-label={`${data.name} 수정`} onClick={() => onEdit(data)}>
          수정
        </Button>
      ) : null,
    },
  ], [onEdit]);
  const gridTheme = useMemo(
    () => getGridTheme(themeName, isDarkMode),
    [themeName, isDarkMode],
  );

  return (
    <AgGridReact<User>
      modules={modules}
      theme={gridTheme}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowData={users}
      getRowId={getRowId}
      pagination={false}
      containerStyle={{ height: "auto" }}
      domLayout="autoHeight"
    />
  );
}

export default UserTable;
