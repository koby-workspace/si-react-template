import type { User, UserListQuery, UserListResult } from "../types";

export function queryUsers(
  users: User[],
  query: UserListQuery,
): UserListResult {
  const name = query.name.trim().toLowerCase();
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(name) &&
      (query.activeYn === "" || user.activeYn === query.activeYn),
  );
  const startIndex = (query.page - 1) * query.pageSize;

  return {
    items: filteredUsers
      .slice(startIndex, startIndex + query.pageSize)
      .map((user) => ({ ...user })),
    total: filteredUsers.length,
  };
}
