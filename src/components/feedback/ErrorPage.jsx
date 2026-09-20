import { Button, Result } from "antd";

function ErrorPage({
  status = "error",
  title = "오류가 발생했습니다",
  subTitle = "잠시 후 다시 시도해 주세요.",
  actionLabel,
  onAction,
}) {
  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={
        actionLabel && onAction ? (
          <Button type="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null
      }
    />
  );
}

export default ErrorPage;
