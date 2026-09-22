import { createLocalStorageStore } from "../../../storage/createLocalStorageStore.js";
import { addStoredUserHistory } from "../../userHistory/api/mockUserHistoryStore.js";
import { fieldLabels } from "../../userHistory/userHistoryOptions.js";
import { getUserGroups } from "../../userGroups/api/mockUserGroupStore.js";

const names = ["김민수", "이서준", "박지우", "최도윤", "정현우"];

const initialUsers = Array.from({ length: 45 }, (_, index) => {
  const userNumber = index + 1;

  return {
    id: String(userNumber),
    loginId:
      userNumber === 1 ? "admin" : `user${String(userNumber).padStart(2, "0")}`,
    name: userNumber === 1 ? "관리자" : names[index % names.length],
    email:
      userNumber === 1 ? "admin@example.com" : `user${userNumber}@example.com`,
    groupId: userNumber === 1 ? "group-admin" : "group-user",
    status: userNumber % 7 === 0 ? "미사용" : "사용",
    createdAt: `2026-09-${String((index % 20) + 1).padStart(2, "0")}`,
  };
});

const userStore = createLocalStorageStore({
  key: "si-react-template:users",
  version: 1,
  initialData: initialUsers,
});

const historyFields = ["loginId", "name", "email", "groupId", "status"];

function createHistoryId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `history-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toDisplayValue(field, value) {
  if (value == null) return null;
  if (field !== "groupId") return value;
  return getUserGroups().find(({ id }) => id === value)?.name ?? value;
}

function buildChanges(before, after) {
  return historyFields
    .filter((field) => before?.[field] !== after?.[field])
    .map((field) => ({
      field,
      before: toDisplayValue(field, before?.[field]),
      after: toDisplayValue(field, after?.[field]),
    }));
}

function recordHistory(action, user, changes) {
  if (changes.length === 0) return;

  const changedFields = changes.map(({ field }) => fieldLabels[field] ?? field);
  addStoredUserHistory({
    id: createHistoryId(),
    entityId: user.id,
    entityName: `${user.loginId} (${user.name})`,
    entityLoginId: user.loginId,
    entityUserName: user.name,
    action,
    actor: "admin",
    occurredAt: new Date().toISOString(),
    summary:
      action === "CREATE"
        ? "사용자 등록"
        : action === "DELETE"
          ? "사용자 삭제"
          : `${changedFields.join(", ")} 변경`,
    changes,
  });
}

export async function getUsers(params = {}) {
  const users = userStore.read();
  const normalizedLoginId = params.loginId?.trim().toLowerCase();
  const normalizedName = params.name?.trim().toLowerCase();
  const normalizedEmail = params.email?.trim().toLowerCase();

  return users.filter((user) => {
    const matchesLoginId =
      !normalizedLoginId || user.loginId.toLowerCase().includes(normalizedLoginId);
    const matchesName =
      !normalizedName || user.name.toLowerCase().includes(normalizedName);
    const matchesEmail =
      !normalizedEmail || user.email.toLowerCase().includes(normalizedEmail);
    const matchesGroup = !params.groupId || user.groupId === params.groupId;
    const matchesStatus = !params.status || user.status === params.status;

    return matchesLoginId && matchesName && matchesEmail && matchesGroup && matchesStatus;
  });
}

export async function createUser(values) {
  const users = userStore.read();
  const duplicated = users.some(
    (user) => user.loginId.toLowerCase() === values.loginId.toLowerCase(),
  );

  if (duplicated) {
    throw new Error("이미 사용 중인 아이디입니다.");
  }

  const nextId = String(Math.max(0, ...users.map(({ id }) => Number(id))) + 1);
  const userValues = { ...values };
  delete userValues.password;
  delete userValues.passwordConfirm;
  const newUser = {
    ...userValues,
    id: nextId,
    createdAt: new Date().toLocaleDateString("sv-SE"),
  };

  userStore.write([newUser, ...users]);
  recordHistory("CREATE", newUser, buildChanges(null, newUser));
  return newUser;
}

export async function updateUser(id, values) {
  const users = userStore.read();
  const previousUser = users.find((user) => user.id === id);
  if (!previousUser) return;

  const updatedUser = { ...previousUser, ...values };
  userStore.write(users.map((user) => (user.id === id ? updatedUser : user)));
  recordHistory("UPDATE", updatedUser, buildChanges(previousUser, updatedUser));
}

export async function deleteUsers(ids) {
  const selectedIds = new Set(ids);
  const users = userStore.read();
  const deletedUsers = users.filter((user) => selectedIds.has(user.id));
  userStore.write(users.filter((user) => !selectedIds.has(user.id)));
  deletedUsers.forEach((user) => {
    recordHistory("DELETE", user, buildChanges(user, null));
  });
}

export function getAllUsers() {
  return userStore.read();
}

export function assignUsersToGroup(groupId, userIds) {
  const selectedIds = new Set(userIds);
  const users = userStore.read();
  const updatedUsers = users.map((user) => {
      if (user.groupId === groupId && !selectedIds.has(user.id)) {
        return { ...user, groupId: "group-user" };
      }
      if (selectedIds.has(user.id)) {
        return { ...user, groupId };
      }
      return user;
    });

  userStore.write(updatedUsers);
  updatedUsers.forEach((user, index) => {
    recordHistory("UPDATE", user, buildChanges(users[index], user));
  });
}
