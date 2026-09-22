import { createLocalStorageStore } from "../../../storage/createLocalStorageStore.js";

const historyStore = createLocalStorageStore({
  key: "si-react-template:user-history",
  version: 1,
  initialData: [],
});

export function getStoredUserHistory() {
  return historyStore.read();
}

export function addStoredUserHistory(history) {
  historyStore.write([history, ...historyStore.read()]);
}
