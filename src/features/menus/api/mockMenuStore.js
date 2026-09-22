import { createLocalStorageStore } from "../../../storage/createLocalStorageStore.js";

const initialMenus = [
  { id: "menu-dashboard", name: "대시보드", path: "/dashboard", parentId: null, order: 1, enabled: true },
  { id: "menu-users", name: "사용자 관리", path: "/users", parentId: null, order: 2, enabled: true },
  { id: "menu-user-history", name: "사용자 변경 이력", path: "/user-history", parentId: null, order: 3, enabled: true },
  { id: "menu-user-groups", name: "사용자 그룹", path: "/user-groups", parentId: null, order: 4, enabled: true },
  { id: "menu-management", name: "메뉴 관리", path: "/menus", parentId: null, order: 5, enabled: true },
];

const menuStore = createLocalStorageStore({
  key: "si-react-template:menus",
  version: 3,
  initialData: initialMenus,
});

export function getStoredMenus() {
  return menuStore.read();
}

export function addStoredMenu(menu) {
  menuStore.write([...menuStore.read(), menu]);
}

export function updateStoredMenu(id, values) {
  menuStore.write(
    menuStore
      .read()
      .map((menu) => (menu.id === id ? { ...menu, ...values } : menu)),
  );
}

export function deleteStoredMenu(id) {
  menuStore.write(menuStore.read().filter((menu) => menu.id !== id));
}
