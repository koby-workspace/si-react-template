import { mockUsers } from "../mockUsers";
import type { UserListQuery, UserListResult } from "../types";
import { queryUsers } from "./queryUsers";

const users = mockUsers.map((user) => ({ ...user }));

export async function getUsers(query: UserListQuery): Promise<UserListResult> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 400);
  });

  return queryUsers(users, query);
}
