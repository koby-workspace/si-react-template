import { useState } from "react";
import { Button, Input, Layout } from "antd";
import "./styles.css";

function App() {
  const [keyword, setKeyword] = useState("");

  function handleReset() {
    setKeyword("");
  }

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-top">SI React Template</Layout.Header>
      <Layout className="app-body">
        <Layout.Sider width={208} theme="light" className="app-left">
          Left 영역
        </Layout.Sider>
        <Layout.Content className="app-content">Content 영역</Layout.Content>
      </Layout>
    </Layout>
  );
}

export default App;
