import React from 'react';

type ColorPalletProps = {
  colors: { name: string; style: string }[];
  theme: 'light' | 'midnight';
};

export const ColorPallet: React.FC<ColorPalletProps> = ({ colors, theme }) => {
  return (
    <div className={theme === 'light' ? 'theme-light' : 'theme-midnight'}>
      <div className="flex flex-col">
        {colors.map(({ name, style }) => {
          return (
            <div className="flex flex-1">
              <div className="w-24">{name}</div>
              <div className={`${style} w-full h-8`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
