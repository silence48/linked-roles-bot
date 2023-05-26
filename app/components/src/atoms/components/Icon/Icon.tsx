import React from 'react';
import clsx from 'clsx';
import { icons } from '../../../assets/icons';

export type IconKeys = keyof typeof icons; 

type IconProps = {
  name: IconKeys;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  color?: string;
  viewBox?: string;
  customCss?: string;
};

type PathProps = {
  name: IconKeys;
  color?: string;
  outline?: boolean;
};

const Path: React.FC<PathProps> = ({ name }: { name: IconKeys}) => {

  return <path d={icons[`${name}`]} className="w-full" fill='currentColor'/>;
};

export const Icon: React.FunctionComponent<IconProps> = ({
  name,
  color,
  viewBox = '0 0 14 16',
  size = 'small',
  customCss,
}) => {
  const iconStyle = clsx(
    size === 'tiny' && 'w-[18px] h-[18px]',
    size === 'small' && 'w-[22px] h-[22px]',
    size === 'medium' && 'w-[30px] h-[30px]',
    size === 'large' && 'w-[36px] h-[36px]',
    size === 'xlarge' && 'w-[48px] h-[48px] flex justify-center',
    `${customCss}`
  );

  return (
    <svg viewBox={viewBox} className={iconStyle} fill="currentColor">
      <Path name={name} />
    </svg>
  );
};
