import { Breadcrumb } from "antd";

const standalonePaths = {
  "/notifications": ["알림"],
};

function findMenuTrail(menus, pathname) {
  const currentMenu = menus
    .filter(({ path }) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];

  if (!currentMenu) return null;

  const trail = [];
  let menu = currentMenu;
  while (menu) {
    trail.unshift(menu.name);
    menu = menus.find(({ id }) => id === menu.parentId);
  }

  if (pathname !== currentMenu.path) trail.push("상세");
  return trail;
}

function CurrentMenuPath({ menus, pathname }) {
  const labels = findMenuTrail(menus, pathname)
    ?? standalonePaths[pathname]
    ?? ["페이지를 찾을 수 없음"];

  return (
    <div aria-label="현재 메뉴 경로">
      <Breadcrumb
        items={labels.map((title, index) => ({
          title: index === labels.length - 1
            ? <span style={{ fontWeight: 600 }}>{title}</span>
            : title,
        }))}
      />
    </div>
  );
}

export default CurrentMenuPath;
