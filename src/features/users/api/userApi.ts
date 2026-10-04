import { mockUsers } from "../mockUsers";
import type {
  User,
  UserFormValues,
  UserListQuery,
  UserListResult,
} from "../types";
import { queryUsers } from "./queryUsers";

let users = mockUsers.map((user) => ({ ...user }));

// 오류 화면 확인 시 true로 변경하고, 확인 후 false로 되돌립니다.
const SHOULD_FAIL_USER_LIST = false;

export async function getUsers(query: UserListQuery): Promise<UserListResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 400);
  });

  if (SHOULD_FAIL_USER_LIST) {
    throw new Error("모의 사용자 목록 조회 실패");
  }

  return queryUsers(users, query);
}

export async function createUser(values: UserFormValues): Promise<User> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 400);
  });

  const id = values.id.trim();
  const name = values.name.trim();
  const email = values.email.trim();
  const department = values.department.trim();
  if (!id) throw new Error("ID를 입력해 주세요.");
  if (users.some((user) => user.id.toLowerCase() === id.toLowerCase())) {
    throw new Error("이미 등록된 ID입니다.");
  }
  if (!name) throw new Error("이름을 입력해 주세요.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("올바른 이메일을 입력해 주세요.");
  }
  if (values.activeYn !== "Y" && values.activeYn !== "N") {
    throw new Error("활성 여부는 Y 또는 N이어야 합니다.");
  }
  if (
    users.some(
      (user) => user.email.trim().toLowerCase() === email.toLowerCase(),
    )
  ) {
    throw new Error("이미 등록된 이메일입니다.");
  }

  const user: User = {
    id,
    name,
    email,
    department,
    activeYn: values.activeYn,
  };
  users = [user, ...users];
  return { ...user };
}
