import {
  addStoredNotice,
  addStoredReadNoticeId,
  deleteStoredNotice,
  getStoredNotices,
  getStoredReadNoticeIds,
  updateStoredNotice,
} from "./mockNoticeStore.js";
import {
  getStoredNotifications,
  setStoredNotifications,
} from "../../notifications/api/mockNotificationStore.js";
import { createNotification } from "../../notifications/api/notificationApi.js";

function withReadStatus(notice, readNoticeIds) {
  return {
    ...notice,
    read: readNoticeIds.includes(notice.id),
    sendNotification: getStoredNotifications().some(
      ({ targetPath }) => targetPath === `/notices/${notice.id}`,
    ),
  };
}

export async function getNotices({ keyword = "" } = {}) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const readNoticeIds = getStoredReadNoticeIds();
  return getStoredNotices().filter(
    ({ title, content }) =>
      !normalizedKeyword ||
      title.toLowerCase().includes(normalizedKeyword) ||
      content.toLowerCase().includes(normalizedKeyword),
  ).map((notice) => withReadStatus(notice, readNoticeIds));
}

export async function getNotice(id) {
  const notice = getStoredNotices().find((item) => item.id === id);
  return notice
    ? withReadStatus(notice, getStoredReadNoticeIds())
    : null;
}

export async function markNoticeAsRead(id) {
  addStoredReadNoticeId(id);
  const targetPath = `/notices/${id}`;
  setStoredNotifications(
    getStoredNotifications().map((notification) =>
      notification.targetPath === targetPath
        ? { ...notification, read: true }
        : notification,
    ),
  );
  window.dispatchEvent(new Event("notifications-changed"));
}

export async function createNotice(values) {
  const notice = {
    id: crypto.randomUUID(),
    title: values.title,
    content: values.content,
    important: values.important ?? false,
    author: "관리자",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  addStoredNotice(notice);
  if (values.sendNotification) {
    await createNotification({
      source: "공지사항",
      title: notice.title,
      targetPath: `/notices/${notice.id}`,
    });
  }
  return notice;
}

export async function updateNotice(id, values) {
  updateStoredNotice(id, {
    title: values.title,
    content: values.content,
    important: values.important ?? false,
  });

  const targetPath = `/notices/${id}`;
  const notifications = getStoredNotifications();
  const linkedNotification = notifications.find((item) => item.targetPath === targetPath);

  if (values.sendNotification && !linkedNotification) {
    await createNotification({ source: "공지사항", title: values.title, targetPath });
  } else {
    setStoredNotifications(
      notifications
        .filter((item) => values.sendNotification || item.targetPath !== targetPath)
        .map((item) => item.targetPath === targetPath ? { ...item, title: values.title } : item),
    );
    window.dispatchEvent(new Event("notifications-changed"));
  }
}

export async function deleteNotice(id) {
  deleteStoredNotice(id);
  const targetPath = `/notices/${id}`;
  setStoredNotifications(
    getStoredNotifications().filter((item) => item.targetPath !== targetPath),
  );
  window.dispatchEvent(new Event("notifications-changed"));
}
