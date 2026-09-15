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
