import { Button, Form, Input } from "antd";

export type UserSearchValues = {
  name: string;
};

type UserSearchFormProps = {
  onSearch: (values: UserSearchValues) => void;
};

function UserSearchForm({ onSearch }: UserSearchFormProps) {
  return (
    <Form<UserSearchValues>
      name="user-search"
      layout="inline"
      initialValues={{ name: "" }}
      onFinish={onSearch}
    >
      <Form.Item name="name" label="이름">
        <Input placeholder="이름 일부 입력" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          검색
        </Button>
      </Form.Item>
    </Form>
  );
}

export default UserSearchForm;
