import httpClient from "../../../api/httpClient.js";
import * as mockUserGroupApi from "./mockUserGroupApi.js";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

export async function getUserGroups() {
  if (useMockApi) return mockUserGroupApi.getUserGroups();
  const response = await httpClient.get("/user-groups");
  return response.data.items ?? response.data;
}

export async function createUserGroup(values) {
  if (useMockApi) return mockUserGroupApi.createUserGroup(values);
  const response = await httpClient.post("/user-groups", values);
  return response.data;
}

export async function updateUserGroup(id, values) {
  if (useMockApi) return mockUserGroupApi.updateUserGroup(id, values);
  const response = await httpClient.put(`/user-groups/${id}`, values);
  return response.data;
}

export async function deleteUserGroup(id) {
  if (useMockApi) return mockUserGroupApi.deleteUserGroup(id);
  await httpClient.delete(`/user-groups/${id}`);
}

export async function updateGroupUsers(id, userIds) {
  if (useMockApi) return mockUserGroupApi.updateGroupUsers(id, userIds);
  await httpClient.put(`/user-groups/${id}/users`, { userIds });
}

