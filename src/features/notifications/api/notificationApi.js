import { getStoredNotifications, setStoredNotifications } from "./mockNotificationStore.js";
import { addStoredReadNoticeId } from "../../notices/api/mockNoticeStore.js";

export const NOTIFICATIONS_CHANGED_EVENT = "notifications-changed";

function notifyChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

function markLinkedNoticeAsRead(targetPath) {
  const match = targetPath?.match(/^\/notices\/([^/]+)$/);
  if (match) addStoredReadNoticeId(match[1]);
}

export async function getNotifications() {
  return getStoredNotifications();
}

export async function getUnreadNotificationCount() {
  return getStoredNotifications().filter(({ read }) => !read).length;
}

export async function markNotificationAsRead(id) {
  const notification = getStoredNotifications().find((item) => item.id === id);
  setStoredNotifications(
    getStoredNotifications().map((item) => item.id === id ? { ...item, read: true } : item),
  );
  if (notification) markLinkedNoticeAsRead(notification.targetPath);
  notifyChanged();
}

export async function markAllNotificationsAsRead() {
  const notifications = getStoredNotifications();
  notifications.forEach(({ targetPath }) => markLinkedNoticeAsRead(targetPath));
  setStoredNotifications(notifications.map((item) => ({ ...item, read: true })));
  notifyChanged();
}

// 공지사항뿐 아니라 어떤 feature에서도 이 함수로 공통 알림을 등록할 수 있습니다.
export async function createNotification({ source, title, targetPath }) {
  const notification = {
    id: crypto.randomUUID(),
    source,
    title,
    targetPath,
    createdAt: new Date().toLocaleString("ko-KR"),
    read: false,
  };
  setStoredNotifications([notification, ...getStoredNotifications()]);
  notifyChanged();
  return notification;
}
