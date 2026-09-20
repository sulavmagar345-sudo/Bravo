import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<Props> = ({ title, subtitle, action }) => (
  <header className="admin-page-header">
    <div>
      <h1 className="admin-page-header__title">{title}</h1>
      {subtitle && <p className="admin-page-header__sub">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </header>
);

export default PageHeader;
