import httpClient from "../../../api/httpClient.js";
import * as mockUserHistoryApi from "./mockUserHistoryApi.js";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

export async function getUserHistory(params) {
  if (useMockApi) return mockUserHistoryApi.getUserHistory(params);

  const response = await httpClient.get("/user-histories", { params });
  return response.data.items ?? response.data;
}
