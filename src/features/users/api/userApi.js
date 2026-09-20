import httpClient from "../../../api/httpClient.js";
import * as mockUserApi from "./mockUserApi.js";
import { getUserGroups as getStoredUserGroups } from "../../userGroups/api/mockUserGroupStore.js";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

export async function getUsers(params) {
  if (useMockApi) {
    const users = await mockUserApi.getUsers(params);
    const groups = getStoredUserGroups();
    return users.map((user) => ({
      ...user,
      groupName: groups.find((group) => group.id === user.groupId)?.name ?? "-",
    }));
  }

  const response = await httpClient.get("/users", { params });
  return response.data.items ?? response.data;
}

export async function createUser(values) {
  if (useMockApi) {
    return mockUserApi.createUser(values);
  }

  const response = await httpClient.post("/users", values);
  return response.data;
}

export async function updateUser(id, values) {
  if (useMockApi) {
    return mockUserApi.updateUser(id, values);
  }

  const response = await httpClient.put(`/users/${id}`, values);
  return response.data;
}

export async function deleteUsers(ids) {
  if (useMockApi) {
    return mockUserApi.deleteUsers(ids);
  }

  await httpClient.delete("/users", { data: { ids } });
}
