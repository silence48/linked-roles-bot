import React from 'react';

type TextListProps = {
  items?: [];
};

export const TextList: React.FC<TextListProps> = ({
  items
}) => {

  return <div className="grid grid-cols-3 gap-4 content-start">{items?.map((item: any, key) => {
    return <div key={key}><div className="text-[14px] text-neutral-800 font-bold">{item[0]}</div><div className="text-[16.2px] text-neutral-900">{item[1]}</div></div>
  })}</div>;
};
