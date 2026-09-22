import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Space } from "antd";

function PageToolbar({ children, onSearch, actions = [] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        width: "100%",
      }}
    >
      {onSearch && (
        <Form
          layout="inline"
          onFinish={onSearch}
          style={{ display: "flex", flex: 1, flexWrap: "wrap", rowGap: 16 }}
        >
          {children}
          <Form.Item style={{ marginInlineEnd: 0 }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              조회
            </Button>
          </Form.Item>
        </Form>
      )}

      {actions.length > 0 && (
        <Space wrap style={{ marginInlineStart: "auto" }}>
          {actions}
        </Space>
      )}
    </div>
  );
}

export default PageToolbar;
