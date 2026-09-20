let userGroups = [
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

export function getUserGroups() {
  return userGroups;
}

export function addUserGroup(userGroup) {
  userGroups = [...userGroups, userGroup];
}

export function changeUserGroup(id, values) {
  userGroups = userGroups.map((group) =>
    group.id === id ? { ...group, ...values } : group,
  );
}

export function removeUserGroup(id) {
  userGroups = userGroups.filter((group) => group.id !== id);
}
