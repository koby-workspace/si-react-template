import { useCallback, useEffect, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Descriptions, Drawer, Form, Input, message, Select, Space, Tag } from "antd";
import { downloadTableCsv } from "../../../utils/downloadCsv.js";
import * as userHistoryApi from "../api/userHistoryApi.js";
import { actionLabels, actionOptions, fieldLabels } from "../userHistoryOptions.js";
import PageToolbar from "../../../components/layout/PageToolbar.jsx";
import AppDataGrid from "../../../components/data/AppDataGrid.jsx";

const actionColors = {
  CREATE: "green",
  UPDATE: "blue",
  DELETE: "red",
};

const columnDefs = [
  {
    headerName: "작업 일시",
    field: "occurredAt",
    width: 180,
    flex: 0,
    valueFormatter: ({ value }) => new Date(value).toLocaleString("ko-KR"),
  },
  {
    headerName: "구분",
    field: "action",
    width: 90,
    flex: 0,
    cellRenderer: ({ value }) => <Tag color={actionColors[value]}>{actionLabels[value]}</Tag>,
  },
  {
    headerName: "아이디",
    field: "entityLoginId",
    width: 140,
    flex: 0,
  },
  {
    headerName: "이름",
    field: "entityUserName",
    width: 120,
    flex: 0,
  },
  { headerName: "작업자", field: "actor", width: 120, flex: 0 },
  { headerName: "변경 요약", field: "summary" },
];

function UserHistoryPage() {
  const [histories, setHistories] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const loadHistory = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setHistories(await userHistoryApi.getUserHistory(params));
    } catch {
      messageApi.error("사용자 이력을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHistory();
  }, [loadHistory]);

  const handleSearch = ({ period, ...values }) => {
    loadHistory({
      ...values,
      startAt: period?.[0]?.startOf("day").toISOString(),
      endAt: period?.[1]?.endOf("day").toISOString(),
    });
  };

  const handleDownload = () => {
    downloadTableCsv({
      menuName: "사용자 변경 이력",
      columns: columnDefs,
      rows: histories,
    });
  };

  const detailColumnDefs = [
    { headerName: "항목", field: "field", valueFormatter: ({ value }) => fieldLabels[value] ?? value },
    { headerName: "변경 전", field: "before", valueFormatter: ({ value }) => value ?? "-" },
    { headerName: "변경 후", field: "after", valueFormatter: ({ value }) => value ?? "-" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%", minHeight: 0 }}>
      {contextHolder}
      <PageToolbar
        onSearch={handleSearch}
        actions={[
          <Button
            key="download"
            icon={<DownloadOutlined />}
            disabled={histories.length === 0}
            onClick={handleDownload}
          >
            엑셀 다운로드
          </Button>,
        ]}
      >
        <Form.Item label="작업 일시" name="period">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label="구분" name="action">
          <Select allowClear options={actionOptions} style={{ width: 110 }} />
        </Form.Item>
        <Form.Item label="아이디" name="loginId">
          <Input allowClear />
        </Form.Item>
        <Form.Item label="이름" name="name">
          <Input allowClear />
        </Form.Item>
        <Form.Item label="작업자" name="actor">
          <Input allowClear />
        </Form.Item>
      </PageToolbar>

      <AppDataGrid
        fill
        columnDefs={columnDefs}
        rowData={histories}
        loading={loading}
        pagination
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50]}
        onRowClicked={({ data }) => setSelectedHistory(data)}
      />

      <Drawer
        title="사용자 이력 상세"
        width={640}
        open={Boolean(selectedHistory)}
        onClose={() => setSelectedHistory(null)}
      >
        {selectedHistory && (
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="작업 일시">
                {new Date(selectedHistory.occurredAt).toLocaleString("ko-KR")}
              </Descriptions.Item>
              <Descriptions.Item label="구분">
                {actionLabels[selectedHistory.action]}
              </Descriptions.Item>
              <Descriptions.Item label="아이디">
                {selectedHistory.entityLoginId}
              </Descriptions.Item>
              <Descriptions.Item label="이름">
                {selectedHistory.entityUserName}
              </Descriptions.Item>
              <Descriptions.Item label="작업자">
                {selectedHistory.actor}
              </Descriptions.Item>
            </Descriptions>
            <AppDataGrid
              getRowId={({ data }) => data.field}
              columnDefs={detailColumnDefs}
              rowData={selectedHistory.changes}
            />
          </Space>
        )}
      </Drawer>
    </div>
  );
}

export default UserHistoryPage;
