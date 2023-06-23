import React from 'react';

type FakeLinkProps = {
  children: React.ReactNode;
  className: string;
};

export const FakeLink: React.FC<FakeLinkProps> = ({ className, children }) => {
  return<a className={className}>{children}</a>
}
