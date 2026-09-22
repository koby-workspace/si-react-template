import { useCallback, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Popconfirm, Select, Transfer } from "antd";
import * as userGroupApi from "../api/userGroupApi.js";
import * as userApi from "../../users/api/userApi.js";
import PageToolbar from "../../../components/layout/PageToolbar.jsx";
import AppDataGrid from "../../../components/data/AppDataGrid.jsx";

const statusOptions = [
  { value: "사용", label: "사용" },
  { value: "미사용", label: "미사용" },
];

function UserGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editingGroup, setEditingGroup] = useState(undefined);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [mappedUserIds, setMappedUserIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const loadData = useCallback(async () => {
    try {
      const [nextGroups, nextUsers] = await Promise.all([
        userGroupApi.getUserGroups(),
        userApi.getUsers({}),
      ]);
      setGroups(nextGroups);
      setUsers(nextUsers);
      setSelectedGroup((current) =>
        current ? nextGroups.find(({ id }) => id === current.id) ?? null : null,
      );
    } catch {
      messageApi.error("사용자 그룹 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    // API 응답 이후에만 상태를 갱신하는 비동기 조회입니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingGroup(null);
    form.setFieldsValue({ name: "", description: "", status: "사용" });
  };

  const openEditModal = () => {
    setEditingGroup(selectedGroup);
    form.setFieldsValue(selectedGroup);
  };

  const saveGroup = async () => {
    const values = await form.validateFields();
    try {
      if (editingGroup) {
        await userGroupApi.updateUserGroup(editingGroup.id, values);
        messageApi.success("사용자 그룹을 수정했습니다.");
      } else {
        await userGroupApi.createUserGroup(values);
        messageApi.success("사용자 그룹을 추가했습니다.");
      }
      setEditingGroup(undefined);
      setLoading(true);
      await loadData();
    } catch (error) {
      messageApi.error(error.message || "사용자 그룹을 저장하지 못했습니다.");
    }
  };

  const deleteGroup = async () => {
    try {
      await userGroupApi.deleteUserGroup(selectedGroup.id);
      setSelectedGroup(null);
      setLoading(true);
      await loadData();
      messageApi.success("사용자 그룹을 삭제했습니다.");
    } catch (error) {
      messageApi.error(error.message || "사용자 그룹을 삭제하지 못했습니다.");
    }
  };

  const openMappingModal = () => {
    setMappedUserIds(
      users.filter(({ groupId }) => groupId === selectedGroup.id).map(({ id }) => id),
    );
    setMappingOpen(true);
  };

  const saveMapping = async () => {
    try {
      await userGroupApi.updateGroupUsers(selectedGroup.id, mappedUserIds);
      setMappingOpen(false);
      setLoading(true);
      await loadData();
      messageApi.success("소속 사용자를 저장했습니다.");
    } catch {
      messageApi.error("소속 사용자를 저장하지 못했습니다.");
    }
  };

  const columnDefs = [
    { headerName: "그룹명", field: "name" },
    { headerName: "설명", field: "description", flex: 2 },
    { headerName: "사용자 수", field: "userCount", width: 110, flex: 0 },
    { headerName: "상태", field: "status", width: 100, flex: 0 },
  ];

  const mappedUsers = selectedGroup
    ? users.filter(({ groupId }) => groupId === selectedGroup.id)
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%", minHeight: 0 }}>
      {contextHolder}
      <PageToolbar
        actions={[
          <Button key="add" icon={<PlusOutlined />} onClick={openCreateModal}>
            그룹 추가
          </Button>,
          <Button key="edit" icon={<EditOutlined />} disabled={!selectedGroup} onClick={openEditModal}>
            수정
          </Button>,
          <Popconfirm
            key="delete"
            title="사용자 그룹 삭제"
            description="선택한 사용자 그룹을 삭제하시겠습니까?"
            disabled={!selectedGroup}
            onConfirm={deleteGroup}
          >
            <Button danger icon={<DeleteOutlined />} disabled={!selectedGroup}>삭제</Button>
          </Popconfirm>,
          <Button
            key="mapping"
            type="primary"
            icon={<UserAddOutlined />}
            disabled={!selectedGroup}
            onClick={openMappingModal}
          >
            사용자 매핑
          </Button>,
        ]}
      />

      <div style={{ display: "flex", flex: 1, minHeight: 0, gap: 16 }}>
        <AppDataGrid
          fill
          columnDefs={columnDefs}
          rowData={groups}
          loading={loading}
          rowSelection={{
            mode: "singleRow",
            enableClickSelection: true,
          }}
          selectionColumnDef={{ width: 48, resizable: false }}
          onSelectionChanged={({ api }) => setSelectedGroup(api.getSelectedRows()[0] ?? null)}
        />

        {selectedGroup && (
          <div style={{ display: "flex", flex: 1, minWidth: 0, minHeight: 0, flexDirection: "column", gap: 8 }}>
            <strong>{selectedGroup.name} 소속 사용자</strong>
            <AppDataGrid
              fill
              columnDefs={[
                { headerName: "아이디", field: "loginId" },
                { headerName: "이름", field: "name" },
                { headerName: "이메일", field: "email", flex: 2 },
              ]}
              rowData={mappedUsers}
              pagination
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20]}
            />
          </div>
        )}
      </div>

      <Modal
        title={editingGroup ? "사용자 그룹 수정" : "사용자 그룹 추가"}
        open={editingGroup !== undefined}
        okText="저장"
        cancelText="취소"
        onOk={saveGroup}
        onCancel={() => setEditingGroup(undefined)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item label="그룹명" name="name" rules={[{ required: true, whitespace: true }]}>
            <Input maxLength={50} autoFocus />
          </Form.Item>
          <Form.Item label="설명" name="description">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item label="상태" name="status" rules={[{ required: true }]}>
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`${selectedGroup?.name ?? ""} 사용자 매핑`}
        open={mappingOpen}
        width={700}
        okText="저장"
        cancelText="취소"
        onOk={saveMapping}
        onCancel={() => setMappingOpen(false)}
        destroyOnHidden
      >
        <Transfer
          dataSource={users.map((user) => ({
            key: user.id,
            title: `${user.name} (${user.loginId})`,
          }))}
          targetKeys={mappedUserIds}
          onChange={setMappedUserIds}
          render={(item) => item.title}
          titles={["전체 사용자", "소속 사용자"]}
          showSearch
          listStyle={{ width: 300, height: 360 }}
        />
      </Modal>
    </div>
  );
}

export default UserGroupsPage;
