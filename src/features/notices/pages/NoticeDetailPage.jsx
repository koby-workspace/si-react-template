import { Button, Card, Descriptions, Empty, Space, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getNotice, markNoticeAsRead } from "../api/noticeApi.js";

function NoticeDetailPage() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(undefined);

  useEffect(() => {
    const loadNotice = async () => {
      const nextNotice = await getNotice(noticeId);
      if (nextNotice) {
        await markNoticeAsRead(noticeId);
        setNotice({ ...nextNotice, read: true });
      } else {
        setNotice(null);
      }
    };
    loadNotice();
  }, [noticeId]);

  if (notice === undefined) return null;
  if (!notice) return <Empty description="공지사항을 찾을 수 없습니다." />;

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Card
        title={<>{notice.important && <Tag color="red">중요</Tag>}{notice.title}</>}
      >
        <Descriptions size="small" items={[
          { key: "author", label: "작성자", children: notice.author },
          { key: "createdAt", label: "등록일", children: notice.createdAt },
        ]} />
        <Typography.Paragraph style={{ marginTop: 24, whiteSpace: "pre-wrap" }}>
          {notice.content}
        </Typography.Paragraph>
      </Card>
      <Button onClick={() => navigate("/notices")}>목록</Button>
    </Space>
  );
}

export default NoticeDetailPage;
