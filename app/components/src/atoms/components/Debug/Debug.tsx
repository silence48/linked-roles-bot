import clsx from 'clsx';
import React from 'react';

type BadgeProps = {
  children: React.ReactNode
  customCss?: string;
};

export const Debug: React.FC<BadgeProps> = ({ children, customCss }) => {


  return (
    <>
      <div className={`mt-[40px] p-[20px] bg-neutral-150 ${customCss} border rounded-[3px] border-solid border-neutral-200`}>
        <div className="text-neutral-800 font-bold">DEBUG</div>
        <div className="bg-neutral-200  border border-neutral-300 rounded-[2px] px-[32px] py-[16px] text-neutral-600 flex flex-col space-y-[4px">
          {children}
        </div>
      </div>
    </>
  );
};
