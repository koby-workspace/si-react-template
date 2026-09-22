import { useCallback, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Descriptions, Drawer, Form, Input, message, Select, Space, Table, Tag } from "antd";
import * as userHistoryApi from "../api/userHistoryApi.js";
import { actionLabels, actionOptions, fieldLabels } from "../userHistoryOptions.js";

const actionColors = {
  CREATE: "green",
  UPDATE: "blue",
  DELETE: "red",
};

const columns = [
  {
    title: "작업 일시",
    dataIndex: "occurredAt",
    width: 180,
    render: (value) => new Date(value).toLocaleString("ko-KR"),
  },
  {
    title: "구분",
    dataIndex: "action",
    width: 90,
    render: (value) => <Tag color={actionColors[value]}>{actionLabels[value]}</Tag>,
  },
  {
    title: "아이디",
    dataIndex: "entityLoginId",
    width: 140,
    render: (value, record) => value ?? record.entityName.split(" (")[0],
  },
  {
    title: "이름",
    dataIndex: "entityUserName",
    width: 120,
    render: (value, record) =>
      value ?? record.entityName.match(/\((.*)\)$/)?.[1] ?? "-",
  },
  { title: "작업자", dataIndex: "actor", width: 120 },
  { title: "변경 요약", dataIndex: "summary" },
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

  const detailColumns = [
    { title: "항목", dataIndex: "field", render: (value) => fieldLabels[value] ?? value },
    { title: "변경 전", dataIndex: "before", render: (value) => value ?? "-" },
    { title: "변경 후", dataIndex: "after", render: (value) => value ?? "-" },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      {contextHolder}
      <Form layout="inline" onFinish={handleSearch}>
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
        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
          조회
        </Button>
      </Form>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={histories}
        loading={loading}
        pagination={{ pageSize: 20 }}
        locale={{ emptyText: "사용자 변경 이력이 없습니다." }}
        onRow={(record) => ({ onClick: () => setSelectedHistory(record) })}
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
              <Descriptions.Item label="대상 사용자">
                {selectedHistory.entityName}
              </Descriptions.Item>
              <Descriptions.Item label="작업자">
                {selectedHistory.actor}
              </Descriptions.Item>
            </Descriptions>
            <Table
              rowKey="field"
              size="small"
              columns={detailColumns}
              dataSource={selectedHistory.changes}
              pagination={false}
            />
          </Space>
        )}
      </Drawer>
    </Space>
  );
}

export default UserHistoryPage;
