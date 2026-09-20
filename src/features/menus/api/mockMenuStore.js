let menus = [
  { id: "menu-dashboard", name: "대시보드", path: "/dashboard", parentId: null, order: 1, enabled: true },
  { id: "menu-users", name: "사용자 관리", path: "/users", parentId: null, order: 2, enabled: true },
  { id: "menu-user-groups", name: "사용자 그룹", path: "/user-groups", parentId: null, order: 3, enabled: true },
  { id: "menu-management", name: "메뉴 관리", path: "/menus", parentId: null, order: 4, enabled: true },
];

export function getStoredMenus() {
  return menus;
}

export function addStoredMenu(menu) {
  menus = [...menus, menu];
}

export function updateStoredMenu(id, values) {
  menus = menus.map((menu) => (menu.id === id ? { ...menu, ...values } : menu));
}

export function deleteStoredMenu(id) {
  menus = menus.filter((menu) => menu.id !== id);
}
