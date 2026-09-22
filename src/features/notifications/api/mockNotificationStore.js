import { createLocalStorageStore } from "../../../storage/createLocalStorageStore.js";

const initialNotifications = [
  { id: "notification-3", source: "공지사항", title: "시스템 정기 점검 안내", createdAt: "2026-09-22 09:00", read: false, targetPath: "/notices/notice-3" },
  { id: "notification-2", source: "공지사항", title: "개인정보 처리 방침 변경 안내", createdAt: "2026-09-18 14:30", read: false, targetPath: "/notices/notice-2" },
  { id: "notification-1", source: "사용자 정보", title: "비밀번호 변경 주기가 7일 남았습니다.", createdAt: "2026-09-15 10:20", read: true, targetPath: "/users" },
];

const notificationStore = createLocalStorageStore({
  key: "si-react-template:notifications",
  version: 1,
  initialData: initialNotifications,
});

export const getStoredNotifications = () => notificationStore.read();
export const setStoredNotifications = (notifications) => notificationStore.write(notifications);
