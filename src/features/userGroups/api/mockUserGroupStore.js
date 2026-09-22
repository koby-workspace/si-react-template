import { createLocalStorageStore } from "../../../storage/createLocalStorageStore.js";

const initialUserGroups = [
  {
    id: "group-admin",
    name: "관리자",
    description: "시스템 관리자 그룹",
    status: "사용",
    system: true,
  },
  {
    id: "group-user",
    name: "일반 사용자",
    description: "기본 사용자 그룹",
    status: "사용",
    system: true,
  },
];

const userGroupStore = createLocalStorageStore({
  key: "si-react-template:user-groups",
  version: 1,
  initialData: initialUserGroups,
});

export function getUserGroups() {
  return userGroupStore.read();
}

export function addUserGroup(userGroup) {
  userGroupStore.write([...userGroupStore.read(), userGroup]);
}

export function changeUserGroup(id, values) {
  userGroupStore.write(
    userGroupStore
      .read()
      .map((group) => (group.id === id ? { ...group, ...values } : group)),
  );
}

export function removeUserGroup(id) {
  userGroupStore.write(
    userGroupStore.read().filter((group) => group.id !== id),
  );
}
