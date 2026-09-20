import {
  addUserGroup,
  changeUserGroup,
  getUserGroups as getStoredUserGroups,
  removeUserGroup,
} from "./mockUserGroupStore.js";
import {
  assignUsersToGroup,
  getAllUsers,
} from "../../users/api/mockUserApi.js";

export async function getUserGroups() {
  const users = getAllUsers();

  return getStoredUserGroups().map((group) => ({
    ...group,
    userCount: users.filter((user) => user.groupId === group.id).length,
  }));
}

export async function createUserGroup(values) {
  const duplicated = getStoredUserGroups().some(
    (group) => group.name.toLowerCase() === values.name.trim().toLowerCase(),
  );

  if (duplicated) {
    throw new Error("이미 사용 중인 그룹명입니다.");
  }

  const newGroup = {
    ...values,
    id: `group-${Date.now()}`,
    name: values.name.trim(),
    system: false,
  };
  addUserGroup(newGroup);
  return newGroup;
}

export async function updateUserGroup(id, values) {
  const duplicated = getStoredUserGroups().some(
    (group) =>
      group.id !== id &&
      group.name.toLowerCase() === values.name.trim().toLowerCase(),
  );

  if (duplicated) {
    throw new Error("이미 사용 중인 그룹명입니다.");
  }

  changeUserGroup(id, { ...values, name: values.name.trim() });
}

export async function deleteUserGroup(id) {
  const group = getStoredUserGroups().find((item) => item.id === id);
  if (group?.system) {
    throw new Error("기본 그룹은 삭제할 수 없습니다.");
  }
  if (getAllUsers().some((user) => user.groupId === id)) {
    throw new Error("소속 사용자가 있는 그룹은 삭제할 수 없습니다.");
  }
  removeUserGroup(id);
}

export async function updateGroupUsers(groupId, userIds) {
  assignUsersToGroup(groupId, userIds);
}

