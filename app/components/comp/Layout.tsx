import React from 'react';
import clsx from 'clsx';

type LayoutProps = {
  children: React.ReactNode;
  variant?: 'small' | 'medium' | 'large' | 'full' | 'tiny'
  customCss?: string;
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  variant = 'small',
  customCss = ''
}) => {
  const style= clsx(
    variant === 'tiny' && 'sm:max-w-sm',
    variant === 'small' && 'sm:max-w-screen-sm',
    variant === 'large' && 'sm:max-w-screen-lg',
    variant === 'full' && 'sm:max-w-screen-2xl',
    `max-w-screen-sm w-full mx-auto ${customCss}`
  )
  return (
    <div className={style}>
      {children}
    </div>
  );
};
