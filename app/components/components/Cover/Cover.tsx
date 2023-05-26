import React from 'react';
import clsx from 'clsx';

type CoverProps = {
  imageUrl: string;
  variant?: 'medium' | 'large';
  fade?: boolean;
};

export const Cover: React.FC<CoverProps> = ({ imageUrl, variant = 'large', fade = false }) => {
  const style = clsx(
    variant === 'medium' && 'h-[160px]',
    variant === 'large' && 'h-[260px] rounded-t-[20px]',
    "bg-cover bg-center w-full object-center object-cover")
  return (
    <div className={style} style={{ backgroundImage: `linear-gradient(to top, rgba(28, 24, 30, 1), rgba(28, 24, 30, 0.2), rgba(249, 252, 255, 0.16)), url('${imageUrl}')`, backgroundSize: 'cover'}} ></div>
  );};
