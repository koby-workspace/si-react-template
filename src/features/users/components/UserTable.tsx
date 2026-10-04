import { useMemo } from "react";
import { Button, Checkbox } from "antd";
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
  selectedUsers: User[];
  onSelect: (user: User, checked: boolean) => void;
  onSelectPage: (users: User[], checked: boolean) => void;
};

function UserTable({ users, themeName, isDarkMode, onEdit, selectedUsers, onSelect, onSelectPage }: UserTableProps) {
  const columnDefs = useMemo<ColDef<User>[]>(() => [
    {
      headerName: "선택",
      width: 64,
      minWidth: 64,
      maxWidth: 64,
      headerComponent: () => {
        const selectedCount = users.filter((user) => selectedUsers.some((selected) => selected.id === user.id)).length;
        return (
          <Checkbox
            aria-label="현재 페이지 전체 선택"
            checked={users.length > 0 && selectedCount === users.length}
            indeterminate={selectedCount > 0 && selectedCount < users.length}
            onChange={(event) => onSelectPage(users, event.target.checked)}
          />
        );
      },
      cellRenderer: ({ data }: ICellRendererParams<User>) => data ? (
        <Checkbox
          aria-label={`${data.name} 선택`}
          checked={selectedUsers.some((user) => user.id === data.id)}
          onChange={(event) => onSelect(data, event.target.checked)}
        />
      ) : null,
    },
    ...columns,
    {
      headerName: "작업",
      minWidth: 100,
      width: 100,
      cellRenderer: ({ data }: ICellRendererParams<User>) => data ? (
        <Button size="small" aria-label={`${data.name} 수정`} onClick={() => onEdit(data)}>수정</Button>
      ) : null,
    },
  ], [onEdit, onSelect, onSelectPage, selectedUsers, users]);
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
