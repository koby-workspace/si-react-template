import { Form, Input, Modal, Select } from "antd";
import { statusOptions } from "../userOptions.js";

function UserCreateModal({ open, existingLoginIds, groupOptions, onCreate, onCancel }) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();

    const created = await onCreate({
      ...values,
      loginId: values.loginId.trim(),
      name: values.name.trim(),
      email: values.email.trim(),
    });
    if (created) {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="사용자 추가"
      open={open}
      okText="추가"
      cancelText="취소"
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ groupId: "group-user", status: "사용" }}
      >
        <Form.Item
          label="아이디"
          name="loginId"
          rules={[
            { required: true, whitespace: true, message: "아이디를 입력해 주세요." },
            {
              validator: (_, value) =>
                !value || !existingLoginIds.has(value.trim().toLowerCase())
                  ? Promise.resolve()
                  : Promise.reject(new Error("이미 사용 중인 아이디입니다.")),
            },
          ]}
        >
          <Input autoFocus maxLength={30} />
        </Form.Item>
        <Form.Item
          label="이름"
          name="name"
          rules={[{ required: true, whitespace: true, message: "이름을 입력해 주세요." }]}
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
        <Form.Item
          label="비밀번호"
          name="password"
          rules={[
            { required: true, message: "비밀번호를 입력해 주세요." },
            { min: 8, message: "비밀번호는 8자 이상이어야 합니다." },
          ]}
        >
          <Input.Password maxLength={50} />
        </Form.Item>
        <Form.Item
          label="비밀번호 확인"
          name="passwordConfirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "비밀번호를 다시 입력해 주세요." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                return !value || getFieldValue("password") === value
                  ? Promise.resolve()
                  : Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
              },
            }),
          ]}
        >
          <Input.Password maxLength={50} />
        </Form.Item>
        <Form.Item label="사용자 그룹" name="groupId" rules={[{ required: true }]}>
          <Select options={groupOptions} />
        </Form.Item>
        <Form.Item label="상태" name="status" rules={[{ required: true }]}>
          <Select options={statusOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserCreateModal;
