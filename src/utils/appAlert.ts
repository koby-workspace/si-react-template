import type { App } from "antd";

type ModalApi = ReturnType<typeof App.useApp>["modal"];

let modalApi: ModalApi | null = null;

// AppAlertSetup에서 앱의 테마가 연결된 modal을 등록합니다.
export function connectAppAlert(modal: ModalApi) {
  modalApi = modal;
  return () => {
    if (modalApi === modal) modalApi = null;
  };
}

function getModalApi() {
  if (!modalApi) {
    throw new Error("appAlert 연결 전입니다. AppAlertSetup 배치를 확인해 주세요.");
  }
  return modalApi;
}

function show(type: "success" | "error", content: string) {

  return getModalApi()[type]({
    title: "안내",
    content,
    okText: "확인",
    centered: true,
    closable: false,
    keyboard: false,
    mask: { closable: false },
  });
}

function confirm(
  content: string,
  onOk?: () => void | Promise<void>,
  okText = "확인",
) {
  return getModalApi().confirm({
    title: "삭제 확인",
    content,
    okText,
    cancelText: "취소",
    centered: true,
    closable: false,
    keyboard: true,
    mask: { closable: false },
    onOk,
  });
}

export const appAlert = {
  success: (content: string) => show("success", content),
  error: (content: string) => show("error", content),
  confirm,
};
