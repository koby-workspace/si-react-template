import { useCallback, useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table } from "antd";
import * as menuApi from "../api/menuApi.js";
import PageToolbar from "../../../components/layout/PageToolbar.jsx";

function buildMenuTree(menus, parentId = null) {
  return menus
    .filter((menu) => menu.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((menu) => {
      const children = buildMenuTree(menus, menu.id);
      return { ...menu, children: children.length ? children : undefined };
    });
}

function MenusPage() {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [editingMenu, setEditingMenu] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const loadMenus = useCallback(async () => {
    try {
      const nextMenus = await menuApi.getMenus();
      setMenus(nextMenus);
      setSelectedMenu((current) =>
        current ? nextMenus.find(({ id }) => id === current.id) ?? null : null,
      );
    } catch {
      messageApi.error("메뉴 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    // API 응답 이후에만 상태를 갱신하는 비동기 조회입니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMenus();
  }, [loadMenus]);

  const tableData = useMemo(() => buildMenuTree(menus), [menus]);
  const parentOptions = useMemo(
    () => menus
      .filter(({ id }) => id !== editingMenu?.id)
      .map(({ id, name }) => ({ value: id, label: name })),
    [editingMenu?.id, menus],
  );

  const openCreateModal = () => {
    setEditingMenu(null);
    form.setFieldsValue({
      name: "",
      path: "",
      parentId: selectedMenu?.id,
      order: menus.length + 1,
      enabled: true,
    });
  };

  const openEditModal = () => {
    setEditingMenu(selectedMenu);
    form.setFieldsValue(selectedMenu);
  };

  const saveMenu = async () => {
    const values = await form.validateFields();
    try {
      if (editingMenu) {
        await menuApi.updateMenu(editingMenu.id, values);
        messageApi.success("메뉴를 수정했습니다.");
      } else {
        await menuApi.createMenu(values);
        messageApi.success("메뉴를 추가했습니다.");
      }
      setEditingMenu(undefined);
      setLoading(true);
      await loadMenus();
    } catch (error) {
      messageApi.error(error.message || "메뉴를 저장하지 못했습니다.");
    }
  };

  const deleteMenu = async () => {
    try {
      await menuApi.deleteMenu(selectedMenu.id);
      setSelectedMenu(null);
      setLoading(true);
      await loadMenus();
      messageApi.success("메뉴를 삭제했습니다.");
    } catch (error) {
      messageApi.error(error.message || "메뉴를 삭제하지 못했습니다.");
    }
  };

  const columns = [
    { title: "메뉴명", dataIndex: "name" },
    { title: "경로", dataIndex: "path" },
    { title: "표시 순서", dataIndex: "order", width: 110 },
    {
      title: "사용 여부",
      dataIndex: "enabled",
      width: 110,
      render: (enabled) => (enabled ? "사용" : "미사용"),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      {contextHolder}
      <PageToolbar
        actions={[
          <Button key="add" icon={<PlusOutlined />} onClick={openCreateModal}>
            메뉴 추가
          </Button>,
          <Button key="edit" icon={<EditOutlined />} disabled={!selectedMenu} onClick={openEditModal}>
            수정
          </Button>,
          <Popconfirm
            key="delete"
            title="메뉴 삭제"
            description="선택한 메뉴를 삭제하시겠습니까?"
            disabled={!selectedMenu}
            onConfirm={deleteMenu}
          >
            <Button danger icon={<DeleteOutlined />} disabled={!selectedMenu}>삭제</Button>
          </Popconfirm>,
        ]}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={false}
        defaultExpandAllRows
        rowSelection={{
          type: "radio",
          selectedRowKeys: selectedMenu ? [selectedMenu.id] : [],
          onChange: (_, rows) => setSelectedMenu(rows[0] ?? null),
        }}
        onRow={(record) => ({ onClick: () => setSelectedMenu(record) })}
      />

      <Modal
        title={editingMenu ? "메뉴 수정" : "메뉴 추가"}
        open={editingMenu !== undefined}
        okText="저장"
        cancelText="취소"
        onOk={saveMenu}
        onCancel={() => setEditingMenu(undefined)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item label="메뉴명" name="name" rules={[{ required: true, whitespace: true }]}>
            <Input maxLength={50} autoFocus />
          </Form.Item>
          <Form.Item
            label="경로"
            name="path"
            rules={[
              { required: true, whitespace: true },
              { pattern: /^\//, message: "/로 시작하는 경로를 입력하세요." },
            ]}
          >
            <Input maxLength={100} placeholder="/users" />
          </Form.Item>
          <Form.Item label="상위 메뉴" name="parentId">
            <Select allowClear options={parentOptions} placeholder="최상위 메뉴" />
          </Form.Item>
          <Form.Item label="표시 순서" name="order" rules={[{ required: true }]}>
            <InputNumber min={1} precision={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="사용 여부" name="enabled" rules={[{ required: true }]}>
            <Select options={[
              { value: true, label: "사용" },
              { value: false, label: "미사용" },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

export default MenusPage;
