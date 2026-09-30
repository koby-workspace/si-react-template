import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>주소를 확인하거나 홈으로 이동해 주세요.</p>
      <p><Link to="/">홈으로 이동</Link></p>
    </main>
  );
}

export default NotFoundPage;
