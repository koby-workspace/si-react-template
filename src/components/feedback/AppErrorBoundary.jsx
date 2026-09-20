import { Component } from "react";
import ErrorPage from "./ErrorPage.jsx";

class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("화면 렌더링 중 오류가 발생했습니다.", error, errorInfo);
  }

  componentDidUpdate(previousProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          status="500"
          title="화면을 표시할 수 없습니다"
          subTitle="일시적인 오류가 발생했습니다. 페이지를 새로고침해 주세요."
          actionLabel="새로고침"
          onAction={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
