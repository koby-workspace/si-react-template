import { createLocalStorageStore } from "../../../storage/createLocalStorageStore.js";

const initialNotices = [
  {
    id: "notice-3",
    title: "시스템 정기 점검 안내",
    content: "안정적인 서비스 제공을 위해 이번 주 토요일 02:00부터 04:00까지 정기 점검을 진행합니다.",
    author: "관리자",
    createdAt: "2026-09-22",
    important: true,
  },
  {
    id: "notice-2",
    title: "개인정보 처리 방침 변경 안내",
    content: "개인정보 처리 방침이 변경되었습니다. 변경된 내용을 확인해 주세요.",
    author: "관리자",
    createdAt: "2026-09-18",
    important: true,
  },
  {
    id: "notice-1",
    title: "서비스 이용 안내",
    content: "SI React Template 서비스 이용 안내입니다.",
    author: "관리자",
    createdAt: "2026-09-10",
    important: false,
  },
];

const noticeStore = createLocalStorageStore({
  key: "si-react-template:notices",
  version: 1,
  initialData: initialNotices,
});

const noticeReadStore = createLocalStorageStore({
  key: "si-react-template:notice-reads",
  version: 1,
  initialData: ["notice-1"],
});

export function getStoredNotices() {
  return noticeStore.read();
}

export function addStoredNotice(notice) {
  noticeStore.write([notice, ...noticeStore.read()]);
}

export function updateStoredNotice(id, values) {
  noticeStore.write(
    noticeStore.read().map((notice) =>
      notice.id === id ? { ...notice, ...values } : notice,
    ),
  );
}

export function deleteStoredNotice(id) {
  noticeStore.write(noticeStore.read().filter((notice) => notice.id !== id));
}

export function getStoredReadNoticeIds() {
  return noticeReadStore.read();
}

export function addStoredReadNoticeId(id) {
  const readNoticeIds = noticeReadStore.read();
  if (!readNoticeIds.includes(id)) {
    noticeReadStore.write([...readNoticeIds, id]);
  }
}
