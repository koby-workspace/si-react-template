import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, Modal, Popconfirm, Table, Tag, Typography } from "antd";
import { Link } from "react-router";
import PageToolbar from "../../../components/layout/PageToolbar.jsx";
import { createNotice, deleteNotice, getNotices, updateNotice } from "../api/noticeApi.js";

const columns = [
  {
    title: "확인",
    dataIndex: "read",
    width: 100,
    render: (read) => read
      ? <Tag>읽음</Tag>
      : <Tag color="blue">안 읽음</Tag>,
  },
  {
    title: "제목",
    dataIndex: "title",
    render: (title, notice) => (
      <Link to={`/notices/${notice.id}`}>
        {notice.important && <Tag color="red">중요</Tag>}
        <span style={{ fontWeight: notice.read ? "normal" : 600 }}>{title}</span>
      </Link>
    ),
  },
  { title: "작성자", dataIndex: "author", width: 120 },
  { title: "등록일", dataIndex: "createdAt", width: 140 },
];

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const loadNotices = async (values = {}) => {
    setLoading(true);
    setNotices(await getNotices(values));
    setSelectedNotice(null);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotices();
  }, []);

  const openCreateModal = () => {
    setEditingNotice(null);
    form.setFieldsValue({ title: "", content: "", important: false, sendNotification: false });
  };

  const openEditModal = () => {
    setEditingNotice(selectedNotice);
    form.setFieldsValue(selectedNotice);
  };

  const saveNotice = async () => {
    const values = await form.validateFields();
    try {
      if (editingNotice) {
        await updateNotice(editingNotice.id, values);
        messageApi.success("공지사항을 수정했습니다.");
      } else {
        await createNotice(values);
        messageApi.success("공지사항을 등록했습니다.");
      }
      setEditingNotice(undefined);
      await loadNotices();
    } catch (error) {
      if (error?.errorFields) return;
      messageApi.error("공지사항을 저장하지 못했습니다.");
    }
  };

  const removeNotice = async () => {
    try {
      await deleteNotice(selectedNotice.id);
      await loadNotices();
      messageApi.success("공지사항을 삭제했습니다.");
    } catch {
      messageApi.error("공지사항을 삭제하지 못했습니다.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {contextHolder}
      <Typography.Title level={2} style={{ margin: 0 }}>공지사항</Typography.Title>
      <PageToolbar
        onSearch={loadNotices}
        actions={[
          <Button key="add" icon={<PlusOutlined />} onClick={openCreateModal}>등록</Button>,
          <Button key="edit" icon={<EditOutlined />} disabled={!selectedNotice} onClick={openEditModal}>수정</Button>,
          <Popconfirm
            key="delete"
            title="공지사항 삭제"
            description="선택한 공지사항을 삭제하시겠습니까?"
            okText="삭제"
            cancelText="취소"
            disabled={!selectedNotice}
            onConfirm={removeNotice}
          >
            <Button danger icon={<DeleteOutlined />} disabled={!selectedNotice}>삭제</Button>
          </Popconfirm>,
        ]}
      >
        <Form.Item label="검색어" name="keyword">
          <Input allowClear placeholder="제목 또는 내용" style={{ width: 240 }} />
        </Form.Item>
      </PageToolbar>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={notices}
        loading={loading}
        rowSelection={{
          type: "radio",
          selectedRowKeys: selectedNotice ? [selectedNotice.id] : [],
          onChange: (_, rows) => setSelectedNotice(rows[0] ?? null),
        }}
      />

      <Modal
        title={editingNotice ? "공지사항 수정" : "공지사항 등록"}
        open={editingNotice !== undefined}
        okText="저장"
        cancelText="취소"
        onOk={saveNotice}
        onCancel={() => setEditingNotice(undefined)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item label="제목" name="title" rules={[{ required: true, whitespace: true }]}>
            <Input maxLength={100} autoFocus />
          </Form.Item>
          <Form.Item label="내용" name="content" rules={[{ required: true, whitespace: true }]}>
            <Input.TextArea rows={8} maxLength={2000} showCount />
          </Form.Item>
          <Form.Item name="important" valuePropName="checked">
            <Checkbox>중요 공지</Checkbox>
          </Form.Item>
          <Form.Item name="sendNotification" valuePropName="checked">
            <Checkbox>알림 발송</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default NoticesPage;
