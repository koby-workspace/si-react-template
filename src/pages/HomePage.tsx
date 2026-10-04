import { Link } from "react-router";
import PageHeader from "../components/PageHeader";

function HomePage() {
  return (
    <>
      <PageHeader
        title="홈"
        description={<p>SI 프로젝트의 기반으로 사용할 React + TypeScript 프로젝트입니다.</p>}
      />
      <p><Link to="/dashboard">대시보드로 이동</Link></p>
      <p><Link to="/users">사용자 관리로 이동</Link></p>
    </>
  );
}

export default HomePage;
