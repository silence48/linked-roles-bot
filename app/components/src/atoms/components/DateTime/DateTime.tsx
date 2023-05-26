import React from 'react';
import { getHours, format } from 'date-fns';
import clsx from 'clsx';

type DateTimeProps = {
  to?: string;
  component?: React.ElementType;
  variant?: 'medium' | 'large';
};

const getToday = () => {
  const date = format(+new Date(), 'MMM, dd, eee, yyyy').split(',');
  return { month: date[0], date: date[1], dayWeek: date[2], year: date[3]}
}

export const DateTime: React.FC<DateTimeProps> = ({
  component: Component,
  to,
  variant = 'large'
}: any) => {
  const today = getToday()
  const containerStyle= clsx(
    variant === 'medium' && 'w-[64px] h-[64px]',
    variant === 'large' && 'w-[96px]',
    'block rounded-[8px] overflow-hidden bg-neutral-900 text-center'
  )
  const dateStyle = clsx(
    variant === 'medium' && 'text-[21px] font-bold',
    variant === 'large' && 'text-4xl font-bold'
  )
  const yearStyle = clsx(
    variant === 'medium' && 'text-[7px] font-bold',
    variant === 'large' && 'text-xs font-bold'
  )
  const dayWeekStyle = clsx(
    variant === 'medium' && 'text-[7px] font-bold',
    variant === 'large' && 'text-xs font-bold'
  )
  const monthStyle = clsx(
    variant === 'medium' && 'bg-secondary-400 text-white text-[12px] py-1 font-bold tracking-wider',
    variant === 'large' && 'bg-secondary-400 text-white py-1'
  )
  const topStyle = clsx(
    variant === 'medium' && 'pt-[1px] border-l border-r',
    variant === 'large' && 'pt-1 border-l border-r'
  )
  const botStyle = clsx(
    variant === 'medium' && 'pb-[1px] px-[2px] border-l border-r border-b flex justify-between',
    variant === 'large' && 'pb-2 px-2 border-l border-r border-b flex justify-between'
  )
  return (
    <Component to={to}>
      { variant === "medium" &&
        <div className={containerStyle}>
          <div className={monthStyle}>{today.dayWeek}</div>
          <div className={topStyle}>
            <span className={dateStyle}>{today.date}</span>
          </div>
        </div>
      }
      { variant === "large" &&
        <div className={containerStyle}>
          <div className={monthStyle}>{today.month}</div>
          <div className={topStyle}>
            <span className={dateStyle}>{today.date}</span>
          </div>
          <div className={botStyle}>
            <span className={yearStyle}>{today.dayWeek}</span>
            <span className={dayWeekStyle}>{today.year}</span>
          </div>
        </div>
      }
    </Component>
  );
};
