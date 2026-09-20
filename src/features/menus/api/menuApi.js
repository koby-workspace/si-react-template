import httpClient from "../../../api/httpClient.js";
import * as mockMenuApi from "./mockMenuApi.js";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
export const MENUS_CHANGED_EVENT = "menus-changed";

function notifyMenusChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(MENUS_CHANGED_EVENT));
  }
}

export async function getMenus() {
  if (useMockApi) return mockMenuApi.getMenus();
  const response = await httpClient.get("/menus");
  return response.data.items ?? response.data;
}

export async function createMenu(values) {
  const result = useMockApi
    ? await mockMenuApi.createMenu(values)
    : (await httpClient.post("/menus", values)).data;
  notifyMenusChanged();
  return result;
}

export async function updateMenu(id, values) {
  const result = useMockApi
    ? await mockMenuApi.updateMenu(id, values)
    : (await httpClient.put(`/menus/${id}`, values)).data;
  notifyMenusChanged();
  return result;
}

export async function deleteMenu(id) {
  if (useMockApi) await mockMenuApi.deleteMenu(id);
  else await httpClient.delete(`/menus/${id}`);
  notifyMenusChanged();
}

