import { useState } from "react";
import { Alert, Form, Input, Modal, Select } from "antd";
import type { UserFormValues } from "../types";

type UserFormModalProps = {
  onCancel: () => void;
};

function UserFormModal({ onCancel }: UserFormModalProps) {
  const [form] = Form.useForm<UserFormValues>();
  const [isInputChecked, setIsInputChecked] = useState(false);

  function handleFinish(values: UserFormValues) {
    form.setFieldsValue({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      department: values.department.trim(),
    });
    setIsInputChecked(true);
  }

  return (
    <Modal
      title="사용자 등록"
      open
      centered
      okText="확인"
      cancelText="취소"
      onOk={() => form.submit()}
      onCancel={onCancel}
      styles={{ body: { paddingBottom: 72 } }}
    >
      <p>사용자 등록 기능은 개발 중입니다. 현재는 입력값 검증만 가능합니다.</p>
      {isInputChecked && (
        <Alert
          type="info"
          showIcon
          title="개발 중입니다. 사용자 등록 기능은 아직 완성되지 않아 저장되지 않습니다."
        />
      )}
      <Form<UserFormValues>
        name="user-create"
        form={form}
        layout="vertical"
        initialValues={{ name: "", email: "", department: "", activeYn: "Y" }}
        onFinish={handleFinish}
        onValuesChange={() => setIsInputChecked(false)}
        onFinishFailed={() => setIsInputChecked(false)}
      >
        <Form.Item
          name="name"
          label="이름"
          rules={[{ required: true, whitespace: true, message: "이름을 입력해 주세요." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, whitespace: true, message: "이메일을 입력해 주세요." },
            { type: "email", transform: (value: string) => value.trim(), message: "올바른 이메일을 입력해 주세요." },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="department" label="부서 (선택)">
          <Input />
        </Form.Item>
        <Form.Item
          name="activeYn"
          label="활성 여부"
          rules={[{ required: true, message: "활성 여부를 선택해 주세요." }]}
        >
          <Select<UserFormValues["activeYn"]>
            options={[
              { value: "Y", label: "Y" },
              { value: "N", label: "N" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserFormModal;
