# React 레이아웃과 URL 메뉴 이동 따라 만들기

이 문서는 빈 Vite React 프로젝트에서 시작해 현재 저장소의 화면을 직접 만드는 실습 가이드다. 완성하면 상단 헤더, 접고 펼칠 수 있는 사이드바, 두 개의 메뉴, URL에 따라 바뀌는 화면 컴포넌트가 생긴다. 코드를 입력한 뒤 각 단계의 동작을 브라우저에서 확인하자.

## 0. 목표와 범위

완성 화면에서는 `/` 접속 시 `/dashboard`로 이동한다. 대시보드와 사용자 관리 메뉴를 누르면 각각 `/dashboard`, `/users` 주소로 이동하고 해당 페이지 컴포넌트가 표시된다. 사이드바 버튼은 메뉴를 숨기거나 다시 표시한다. 뒤로 가기, 앞으로 가기, 새로고침에도 현재 URL에 맞는 화면이 표시된다.

배울 내용은 **컴포넌트, JSX, 상태, 이벤트, 조건부 렌더링, 클라이언트 라우팅**이다. 실제 사용자 데이터나 서버 API는 아직 없다. 두 페이지의 내용은 이후 기능을 넣을 자리다.

## 1. 프로젝트 생성과 실행

Node.js와 npm을 설치하고 터미널에서 실행한다. Vite가 React 프로젝트의 기본 파일과 개발 서버를 준비한다. `react` 템플릿은 JavaScript를 사용한다. [Vite 시작 안내](https://vite.dev/guide/)

```bash
npm create vite@latest si-react-template -- --template react
cd si-react-template
npm install
npm run dev
```

터미널에 표시된 로컬 주소를 브라우저에서 연다. Windows PowerShell에서 `npm.ps1` 실행 정책 오류가 나면 `npm` 대신 `npm.cmd`를 사용한다. 예를 들어 `npm.cmd install`, `npm.cmd run dev`다.

이미 이 저장소를 받은 경우 새 프로젝트 생성은 건너뛰고 저장소 루트에서 `npm ci`를 실행하면 `package-lock.json`의 버전에 맞춰 설치된다. 처음부터 실습하는 경우에는 위 Vite 생성 명령부터 진행한다. 생성 시점에 따라 Vite 기본 파일과 패키지 버전은 현재 저장소와 조금 다를 수 있다.

| 파일 | 역할 |
| --- | --- |
| `index.html` | `<div id="root"></div>`로 React가 표시될 위치를 제공한다. |
| `src/main.jsx` | React 앱을 `root`에 연결하는 시작 파일이다. |
| `src/App.jsx` | 전체 레이아웃과 메뉴를 구성하는 컴포넌트다. |
| `src/index.css` | 앱 전체에 적용되는 기본 스타일이다. |
| `package.json` | 설치 패키지와 `dev`, `lint`, `build` 명령을 기록한다. |

`main.jsx`가 소문자로 시작하는 이유는 **컴포넌트가 아니라 시작 파일**이기 때문이다. 반면 `<App />`처럼 JSX에서 사용하는 React 컴포넌트 함수는 대문자로 시작해야 일반 HTML 태그와 구별된다. 파일명 대소문자 자체는 관례지만, 컴포넌트 함수 이름의 대문자는 중요하다. [React 컴포넌트 소개](https://react.dev/learn/your-first-component)

## 2. Ant Design으로 기본 레이아웃 만들기

UI 컴포넌트와 아이콘 패키지를 설치한다. [Ant Design 설치 안내](https://ant.design/docs/react/introduce/)

```bash
npm install antd @ant-design/icons
```

`antd`는 레이아웃, 버튼, 메뉴, 카드 등을 제공한다. `@ant-design/icons`는 접기/펼치기 아이콘을 제공한다. PowerShell에서 필요하면 `npm.cmd install antd @ant-design/icons`로 입력한다.

`src/index.css`를 다음과 같이 바꾼다.

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

`margin: 0`은 브라우저의 기본 여백을 없애고, `box-sizing: border-box`는 요소의 너비 계산에 패딩과 테두리를 포함한다. Vite가 만든 긴 예제 스타일은 이 화면에 필요하지 않다. 생성된 `src/App.css`도 이 실습에서는 import하지 않으므로 사용되지 않는다.

`src/App.jsx`를 다음 코드로 바꾼다.

```jsx
import { Layout } from "antd";

const { Header, Sider, Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "#ffffff" }}>Top</Header>

      <Layout>
        <Sider style={{ color: "#ffffff" }}>Left</Sider>
        <Content style={{ padding: 24 }}>Main</Content>
      </Layout>
    </Layout>
  );
}

export default App;
```

`Layout`은 큰 틀, `Header`는 상단, `Sider`는 왼쪽, `Content`는 본문이다. 바깥 `Layout` 아래에 `Header`와 안쪽 `Layout`을 놓았으므로 본문과 사이드바가 헤더 아래에서 나란히 놓인다. `minHeight: "100vh"`는 레이아웃을 화면 높이 이상으로 만든다. `style={{ ... }}`는 JSX에서 JavaScript 객체를 전달하는 문법이다. [Ant Design Layout](https://ant.design/components/layout/)

브라우저에서 `Top`, `Left`, `Main`이 보이는지 확인한다.

## 3. 사이드바 접기와 펼치기

React의 **상태**는 컴포넌트가 기억해야 하는 값이다. 일반 지역 변수를 바꾸는 것만으로는 React가 화면을 갱신하지 않지만, 상태를 변경하면 해당 컴포넌트가 다시 렌더링된다. [React 상태 설명](https://react.dev/learn/state-a-components-memory)

`src/App.jsx`를 다음 코드로 바꾼다.

```jsx
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";

const { Header, Sider, Content } = Layout;

function App() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ color: "#ffffff", display: "flex", alignItems: "center", gap: 16, paddingLeft: 12 }}
      >
        <Button
          type="primary"
          aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
          onClick={() => setShowSidebar((visible) => !visible)}
          icon={showSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        />
        Top
      </Header>

      <Layout>
        {showSidebar && <Sider style={{ color: "#ffffff" }}>Left</Sider>}
        <Content style={{ padding: 24 }}>Main</Content>
      </Layout>
    </Layout>
  );
}

export default App;
```

- `useState(true)`는 처음에 사이드바를 보여준다는 뜻이다. `showSidebar`는 현재 값, `setShowSidebar`는 값을 바꾸는 함수다.
- `onClick={() => setShowSidebar((visible) => !visible)}`는 클릭할 때마다 이전 값을 반대로 바꾼다. `visible`은 변경 직전의 상태 값이다.
- `{showSidebar && <Sider ... />}`는 값이 참일 때만 사이드바를 렌더링한다. 이것이 **조건부 렌더링**이다.
- `showSidebar ? A : B`는 상태에 따라 버튼의 접근성 이름과 아이콘을 바꾼다. `aria-label`은 아이콘만 있는 버튼의 용도를 보조 기술에 알려 준다.

버튼을 여러 번 눌러 사이드바가 사라졌다가 다시 나타나는지 확인한다. 이 상태는 **사이드바 표시 여부**만 맡는다. 다음 단계에서 **현재 페이지**는 URL이 맡으므로 `selectedPage` 상태를 따로 만들지 않는다.

## 4. 페이지 컴포넌트 만들기

지금까지 본문은 `Main`이라는 글자만 표시했다. 메뉴마다 독립적인 화면을 만들기 위해 `src/pages` 폴더를 만들고 아래 파일 두 개를 추가한다.

`src/pages/DashboardPage.jsx`:

```jsx
import { Card } from "antd";

function DashboardPage() {
  return (
    <>
      <h1>대시보드</h1>
      <Card title="프로젝트 현황">
        <p>여기에 프로젝트 현황을 표시할 수 있습니다.</p>
      </Card>
    </>
  );
}

export default DashboardPage;
```

`src/pages/UsersPage.jsx`:

```jsx
import { Card, Empty } from "antd";

function UsersPage() {
  return (
    <>
      <h1>사용자 관리</h1>
      <Card>
        <Empty description="등록된 사용자가 없습니다." />
      </Card>
    </>
  );
}

export default UsersPage;
```

컴포넌트는 **화면 일부를 반환하는 JavaScript 함수**다. `<>...</>`는 불필요한 HTML 요소를 추가하지 않고 여러 요소를 묶는 Fragment다. `export default`로 내보낸 컴포넌트는 다른 파일에서 `import`해 쓸 수 있다. 현재는 실제 데이터가 없어 카드와 빈 상태만 보이지만, 이후 각 페이지 파일에 독립적인 기능을 추가할 수 있다.

## 5. URL과 화면을 연결하기

React Router의 선언형 라우팅으로 URL과 화면을 연결한다. [React Router 설치 안내](https://reactrouter.com/start/declarative/installation)

```bash
npm install react-router
```

PowerShell에서 필요하면 `npm.cmd install react-router`를 사용한다. 현재 저장소는 `react-router`를 설치하고 그 패키지에서 import한다. 오래된 예제의 `react-router-dom` 명령을 그대로 섞어 쓰지 말고 설치 패키지와 import 경로를 맞춘다.

`src/main.jsx`를 다음 코드로 바꾼다.

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

`index.html`의 `root` 요소를 찾아 `createRoot(...).render(...)`가 React 화면을 그린다. `BrowserRouter`는 그 안의 컴포넌트가 현재 주소를 읽고 주소를 바꿀 수 있게 한다. 따라서 `useLocation`과 `useNavigate`를 쓰는 `App`을 그 안에 넣는다. `StrictMode`는 개발 중 잠재적 문제를 발견하도록 돕는다. [React Router BrowserRouter](https://reactrouter.com/api/declarative-routers/BrowserRouter)

이제 `src/App.jsx`를 **완성 코드**로 바꾼다.

```jsx
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import DashboardPage from "./pages/DashboardPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

const { Header, Sider, Content } = Layout;
const menuItems = [
  { key: "/dashboard", label: "대시보드" },
  { key: "/users", label: "사용자 관리" },
];

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ color: "#ffffff", display: "flex", alignItems: "center", gap: 16, paddingLeft: 12 }}
      >
        <Button
          type="primary"
          aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
          onClick={() => setShowSidebar((visible) => !visible)}
          icon={showSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        />
        Top
      </Header>

      <Layout>
        {showSidebar && (
          <Sider>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
            />
          </Sider>
        )}
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
```

### 메뉴 클릭에서 화면 표시까지

```text
메뉴 클릭 → Menu의 onClick에서 key 받기 → navigate(key)로 URL 변경
         → Routes가 URL과 일치하는 Route 찾기 → 해당 페이지 컴포넌트 표시
         → useLocation이 새 URL을 읽기 → selectedKeys로 메뉴 강조
```

사용자 관리를 클릭하면 메뉴 항목의 `key`는 `"/users"`다. `navigate(key)`가 주소를 `/users`로 바꾸고, `<Route path="/users" element={<UsersPage />} />`가 `UsersPage`를 본문에 표시한다. 제목 문자열만 바꾸는 방식과 달리 화면 자체가 별도 컴포넌트다. [React Router 경로 설정](https://reactrouter.com/start/declarative/routing), [이동 방법](https://reactrouter.com/start/declarative/navigating)

`selectedKeys={[location.pathname]}`는 **현재 URL을 메뉴 선택 표시의 기준**으로 쓴다. 배열인 이유는 Ant Design `Menu`의 `selectedKeys`가 key 배열을 받기 때문이다. `onClick={({ key }) => navigate(key)}`의 `{ key }`는 클릭 이벤트 객체에서 `key`만 꺼내는 **객체 구조 분해 할당**이다. [Ant Design Menu API](https://ant.design/components/menu/)

`<Route path="/" element={<Navigate to="/dashboard" replace />} />`는 첫 접속 주소 `/`를 대시보드로 보낸다. `replace`는 `/` 방문 기록을 대시보드 주소로 대체한다. 이 프로젝트에는 `path="*"` 같은 알 수 없는 경로 처리 규칙을 아직 넣지 않았다. 등록되지 않은 주소에서는 일치하는 페이지가 없어 본문이 비며, 이 정책은 화면이 늘어날 때 결정하면 된다.

## 6. 직접 확인하기

개발 서버가 켜져 있다면 브라우저에서 다음을 차례로 확인한다.

1. `/`에 접속하면 주소가 `/dashboard`로 바뀌고 대시보드 카드가 보인다.
2. 사용자 관리 메뉴를 누르면 `/users`로 바뀌고 빈 상태 카드가 보인다.
3. 주소창에 `/dashboard`와 `/users`를 직접 입력해도 해당 화면이 보인다.
4. `/users`에서 새로고침해도 사용자 관리 화면이 보인다.
5. 두 메뉴 사이를 이동한 뒤 뒤로 가기와 앞으로 가기를 누르면 URL, 화면, 메뉴 강조가 함께 바뀐다.
6. 사이드바를 숨겼다 다시 열어도 URL과 현재 화면은 유지된다.

코드 검사와 배포용 빌드도 실행한다.

```bash
npm run lint
npm run build
```

PowerShell 실행 정책 오류가 있다면 `npm.cmd run lint`, `npm.cmd run build`를 사용한다. `lint`는 코드 규칙을 검사하고, `build`는 배포용 파일을 `dist`에 만든다. 현재 구성에서 빌드는 번들 크기 경고를 낼 수 있지만, 명령이 성공하면 빌드는 완료된 것이다.

## 7. 개념 정리와 다음 단계

- **JavaScript와 JSX:** JSX는 JavaScript 파일에서 HTML과 비슷한 UI 문법을 쓰는 방식이다. `{...}` 안에는 JavaScript 표현식을 넣을 수 있다. [React JSX 안내](https://react.dev/learn/writing-markup-with-jsx)
- **상태와 URL:** 사이드바 표시 여부는 `useState`에 저장한다. 현재 페이지는 URL이 기준이다. 같은 값을 둘 다에 저장하면 동기화할 일이 늘어난다.
- **컴포넌트 분리:** 처음의 작은 레이아웃은 `App` 하나로 충분했다. 메뉴별 화면이 생긴 뒤 `DashboardPage`와 `UsersPage`로 나누면 각 화면의 역할이 보인다. 라우트가 두 개뿐인 지금은 `Route` 설정을 `App`에 그대로 두어도 읽기 쉽다.
- **URL 라우팅:** 특정 화면 주소를 공유하거나 새로고침할 수 있고, 브라우저 방문 기록도 쓸 수 있다. 배포 서버에서도 `/users` 같은 주소로 직접 접속하려면 해당 경로에 `index.html`을 제공하는 SPA fallback 설정이 필요할 수 있다.
- **JavaScript와 TypeScript:** 지금은 JavaScript로 React 흐름을 익혀도 충분하다. props와 서버 데이터 형태가 늘어나면 TypeScript의 정적 검사 이점이 커진다. TypeScript는 별도 학습이 필요하므로 이 실습의 필수 단계로 넣지 않았다.
- **현재 화면의 한계:** 대시보드의 현황 문구와 사용자 관리의 빈 상태는 예시다. 사용자 조회, 검색, 저장, API 연결은 아직 구현하지 않았다.

다음 실습으로 `UsersPage`에 목록 데이터를 넣고 Ant Design `Table`과 검색 입력을 붙이면, 페이지 컴포넌트가 자신의 데이터와 동작을 맡는 이유를 더 분명하게 볼 수 있다.
