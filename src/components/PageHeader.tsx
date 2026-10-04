import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: ReactNode;
};

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      {description}
    </header>
  );
}

export default PageHeader;
