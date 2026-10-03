import { mockUsers } from "../mockUsers";
import type { UserListQuery, UserListResult } from "../types";
import { queryUsers } from "./queryUsers";

const users = mockUsers.map((user) => ({ ...user }));

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
