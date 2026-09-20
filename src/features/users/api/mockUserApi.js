const names = ["김민수", "이서준", "박지우", "최도윤", "정현우"];

let users = Array.from({ length: 45 }, (_, index) => {
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

export async function getUsers(params = {}) {
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

  users = [newUser, ...users];
  return newUser;
}

export async function updateUser(id, values) {
  users = users.map((user) => (user.id === id ? { ...user, ...values } : user));
}

export async function deleteUsers(ids) {
  const selectedIds = new Set(ids);
  users = users.filter((user) => !selectedIds.has(user.id));
}

export function getAllUsers() {
  return users;
}

export function assignUsersToGroup(groupId, userIds) {
  const selectedIds = new Set(userIds);
  users = users.map((user) => {
    if (user.groupId === groupId && !selectedIds.has(user.id)) {
      return { ...user, groupId: "group-user" };
    }
    if (selectedIds.has(user.id)) {
      return { ...user, groupId };
    }
    return user;
  });
}
