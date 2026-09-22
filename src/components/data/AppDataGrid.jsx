import { useMemo } from "react";
import { theme as antdTheme } from "antd";
import { AllCommunityModule, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

const modules = [AllCommunityModule];

const baseDefaultColDef = {
  flex: 1,
  minWidth: 120,
  sortable: true,
  filter: true,
  resizable: true,
};

function AppDataGrid({ fill = false, defaultColDef, ...props }) {
  const { token } = antdTheme.useToken();
  const gridTheme = useMemo(
    () => themeQuartz.withParams({
      accentColor: token.colorPrimary,
      backgroundColor: token.colorBgContainer,
      borderColor: token.colorBorderSecondary,
      foregroundColor: token.colorText,
      headerBackgroundColor: token.colorFillAlter,
      headerTextColor: token.colorText,
      oddRowBackgroundColor: token.colorFillQuaternary,
      rowHoverColor: token.colorFillTertiary,
      selectedRowBackgroundColor: token.colorPrimaryBg,
      wrapperBorderRadius: 8,
    }),
    [token],
  );

  return (
    <div
      style={{
        width: "100%",
        height: fill ? "100%" : undefined,
        flex: fill ? 1 : undefined,
        minHeight: fill ? 0 : undefined,
        minWidth: 0,
      }}
    >
      <AgGridReact
        modules={modules}
        theme={gridTheme}
        defaultColDef={{ ...baseDefaultColDef, ...defaultColDef }}
        domLayout={fill ? undefined : "autoHeight"}
        getRowId={({ data }) => data.id}
        overlayNoRowsTemplate="표시할 데이터가 없습니다."
        {...props}
      />
    </div>
  );
}

export default AppDataGrid;
