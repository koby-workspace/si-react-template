import {
  addStoredMenu,
  deleteStoredMenu,
  getStoredMenus,
  updateStoredMenu,
} from "./mockMenuStore.js";

function validateMenu(values, editingId) {
  const normalizedPath = values.path.trim();
  const duplicated = getStoredMenus().some(
    (menu) => menu.id !== editingId && menu.path.toLowerCase() === normalizedPath.toLowerCase(),
  );

  if (duplicated) {
    throw new Error("이미 사용 중인 경로입니다.");
  }

  if (editingId && values.parentId) {
    let parentId = values.parentId;
    while (parentId) {
      if (parentId === editingId) {
        throw new Error("하위 메뉴를 상위 메뉴로 지정할 수 없습니다.");
      }
      parentId = getStoredMenus().find(({ id }) => id === parentId)?.parentId;
    }
  }
}

export async function getMenus() {
  return [...getStoredMenus()].sort((a, b) => a.order - b.order);
}

export async function createMenu(values) {
  validateMenu(values);
  const menu = {
    ...values,
    id: `menu-${Date.now()}`,
    name: values.name.trim(),
    path: values.path.trim(),
    parentId: values.parentId ?? null,
  };
  addStoredMenu(menu);
  return menu;
}

export async function updateMenu(id, values) {
  validateMenu(values, id);
  updateStoredMenu(id, {
    ...values,
    name: values.name.trim(),
    path: values.path.trim(),
    parentId: values.parentId ?? null,
  });
}

export async function deleteMenu(id) {
  if (getStoredMenus().some(({ parentId }) => parentId === id)) {
    throw new Error("하위 메뉴가 있는 메뉴는 삭제할 수 없습니다.");
  }
  deleteStoredMenu(id);
}

