import { Button, Form, Input, Select } from "antd";
import type { YN } from "../types";

export type UserSearchValues = {
  name: string;
  activeYn: "" | YN;
};

type UserSearchFormProps = {
  onSearch: (values: UserSearchValues) => void;
  onReset: () => void;
};

function UserSearchForm({ onSearch, onReset }: UserSearchFormProps) {
  const [form] = Form.useForm<UserSearchValues>();

  function handleReset() {
    form.resetFields();
    onReset();
  }

  return (
    <Form<UserSearchValues>
      name="user-search"
      form={form}
      layout="inline"
      initialValues={{ name: "", activeYn: "" }}
      onFinish={onSearch}
    >
      <Form.Item name="name" label="이름">
        <Input placeholder="이름 일부 입력" />
      </Form.Item>
      <Form.Item name="activeYn" label="활성 여부">
        <Select<UserSearchValues["activeYn"]>
          style={{ width: 100 }}
          options={[
            { value: "", label: "전체" },
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          검색
        </Button>
      </Form.Item>
      <Form.Item>
        <Button htmlType="button" onClick={handleReset}>
          초기화
        </Button>
      </Form.Item>
    </Form>
  );
}

export default UserSearchForm;
