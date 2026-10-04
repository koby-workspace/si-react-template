import { useLayoutEffect } from "react";
import { App } from "antd";
import { connectAppAlert } from "../utils/appAlert";

export default function AppAlertSetup() {
  const { modal } = App.useApp();

  // 화면의 조회 Effect가 실행되기 전에 공통 메시지 팝업을 연결합니다.
  useLayoutEffect(() => connectAppAlert(modal), [modal]);

  return null;
}
