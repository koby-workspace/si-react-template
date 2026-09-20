import { useNavigate } from "react-router";
import ErrorPage from "../components/feedback/ErrorPage.jsx";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorPage
      status="404"
      title="페이지를 찾을 수 없습니다"
      subTitle="입력한 주소가 올바른지 확인해 주세요."
      actionLabel="대시보드로 이동"
      onAction={() => navigate("/dashboard", { replace: true })}
    />
  );
}

export default NotFoundPage;
