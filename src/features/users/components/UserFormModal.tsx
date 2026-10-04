import { Alert, Form, Input, Modal, Select } from "antd";
import type { User, UserFormValues } from "../types";

type UserFormModalProps = {
  onCancel: () => void;
  onSave: (values: UserFormValues) => Promise<void>;
  isSaving: boolean;
  saveError: string;
  editingUser: User | null;
};

function UserFormModal({ onCancel, onSave, isSaving, saveError, editingUser }: UserFormModalProps) {
  const [form] = Form.useForm<UserFormValues>();

  function handleFinish(values: UserFormValues) {
    if (isSaving) return;
    const normalizedValues = {
      ...values,
      id: values.id.trim(),
      name: values.name.trim(),
      email: values.email.trim(),
      department: values.department.trim(),
    };
    form.setFieldsValue(normalizedValues);
    void onSave(normalizedValues);
  }

  return (
    <Modal
      title={editingUser ? "사용자 수정" : "사용자 등록"}
      open
      centered
      okText="저장"
      confirmLoading={isSaving}
      okButtonProps={{ disabled: isSaving }}
      cancelButtonProps={{ disabled: isSaving }}
      closable={!isSaving}
      keyboard={!isSaving}
      mask={{ closable: !isSaving }}
      cancelText="취소"
      onOk={() => form.submit()}
      onCancel={onCancel}
      styles={{ body: { paddingBottom: 72 } }}
    >
      <p>{editingUser ? "수정 저장은 개발 중입니다. 입력해도 변경 내용은 저장되지 않습니다." : "등록한 데이터는 새로고침하면 초기화됩니다."}</p>
      {saveError && (
        <Alert
          type="error"
          showIcon
          title={saveError}
        />
      )}
      <Form<UserFormValues>
        name={editingUser ? "user-edit" : "user-create"}
        form={form}
        layout="vertical"
        disabled={isSaving}
        initialValues={editingUser ?? { id: "", name: "", email: "", department: "", activeYn: "Y" }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="id"
          label="ID"
          rules={[{ required: true, whitespace: true, message: "ID를 입력해 주세요." }]}
        >
          <Input readOnly={editingUser !== null} />
        </Form.Item>
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
