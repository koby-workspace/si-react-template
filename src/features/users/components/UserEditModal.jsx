import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import { roleOptions, statusOptions } from "../userOptions.js";

function UserEditModal({ user, onSave, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [form, user]);

  const handleOk = async () => {
    const values = await form.validateFields();

    const saved = await onSave({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
    });

    if (saved) {
      form.resetFields();
    }
  };

  return (
    <Modal
      title="사용자 수정"
      open={Boolean(user)}
      okText="저장"
      cancelText="취소"
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item label="아이디" name="loginId">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="이름"
          name="name"
          rules={[
            { required: true, whitespace: true, message: "이름을 입력해 주세요." },
          ]}
        >
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item
          label="이메일"
          name="email"
          rules={[
            { required: true, message: "이메일을 입력해 주세요." },
            { type: "email", message: "올바른 이메일 형식으로 입력해 주세요." },
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item label="권한" name="role" rules={[{ required: true }]}>
          <Select options={roleOptions} />
        </Form.Item>
        <Form.Item label="상태" name="status" rules={[{ required: true }]}>
          <Select options={statusOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserEditModal;
