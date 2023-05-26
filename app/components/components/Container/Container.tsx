import React from 'react';
import clsx from 'clsx';
type ContainerProps = {
  padding?: 'none' | 'small' | 'large';
  height?: 'screen' | 'small' | '1/3';
  border?: 'none' | 'bottom';
  overflow?: boolean;
  children: React.ReactNode;
  customCss?: string;
};
export const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'none',
  border = 'none',
  height = 'small',
  overflow = false,
  customCss
}) => {
  const style = clsx(
    padding === 'small' && 'px-2',
    height === '1/3' && 'h-v76',
    border === 'bottom' && 'border-b',
    overflow && 'overflow-y-scroll',
    'border-solid border-primary border-collapse',
    `${customCss}`
  );
  return <div className={style}>{children}</div>;
};
