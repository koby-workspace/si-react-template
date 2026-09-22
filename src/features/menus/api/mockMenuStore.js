import { createLocalStorageStore } from "../../../storage/createLocalStorageStore.js";

const initialMenus = [
  { id: "menu-dashboard", name: "대시보드", path: "/dashboard", parentId: null, order: 1, enabled: true },
  { id: "menu-system-management", name: "시스템 관리", path: "/system-management", parentId: null, order: 2, enabled: true },
  { id: "menu-users", name: "사용자 관리", path: "/users", parentId: "menu-system-management", order: 1, enabled: true },
  { id: "menu-user-groups", name: "사용자 그룹 관리", path: "/user-groups", parentId: "menu-system-management", order: 2, enabled: true },
  { id: "menu-management", name: "메뉴 관리", path: "/menus", parentId: "menu-system-management", order: 3, enabled: true },
  { id: "menu-user-history", name: "사용자 변경 이력", path: "/user-history", parentId: "menu-system-management", order: 4, enabled: true },
];

const menuStore = createLocalStorageStore({
  key: "si-react-template:menus",
  version: 6,
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
