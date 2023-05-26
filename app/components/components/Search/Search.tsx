import React from 'react';
import clsx from 'clsx';

type SearchProps = {
  imageUrl: string;
};

export const Search: React.FC<SearchProps> = ({ imageUrl }) => {
  const style = clsx('w-16 h-16 bg-cover bg-center rounded-full');
  return (
    <div
      className={style}
      style={{ backgroundImage: `url(${imageUrl})` }}
    ></div>
  );
};
