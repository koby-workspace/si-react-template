import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { mockUsers } from "./mockUsers";
import type { User } from "./types";

const columns: TableColumnsType<User> = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "이름", dataIndex: "name", key: "name" },
  { title: "이메일", dataIndex: "email", key: "email" },
  {
    title: "부서",
    dataIndex: "department",
    key: "department",
    render: (department: string) => department || "-",
  },
  {
    title: "활성 여부",
    dataIndex: "activeYn",
    key: "activeYn",
  },
];

function UserPage() {
  return (
    <>
      <h1>사용자 관리</h1>
      <Table<User>
        columns={columns}
        dataSource={mockUsers}
        rowKey="id"
        pagination={false}
        scroll={{ x: 720 }}
      />
    </>
  );
}

export default UserPage;
