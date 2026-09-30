import { Link } from "react-router";

function HomePage() {
  return (
    <>
      <h1>홈</h1>
      <p>SI 프로젝트의 기반으로 사용할 React + TypeScript 프로젝트입니다.</p>
      <p><Link to="/dashboard">대시보드로 이동</Link></p>
      <p><Link to="/users">사용자 관리로 이동</Link></p>
    </>
  );
}

export default HomePage;
