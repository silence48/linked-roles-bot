import React from 'react';
import { Icon } from '../Icon';

type GroupItemsProps = {
  items?: any;
};

export const GroupItems: React.FC<GroupItemsProps> = ({
  items
}) => {

  return <div className="grid grid-cols-2 gap-4 content-start p-[8px]">{items?.map((item: any, key: string) => {
    return <div key={key} className="flex space-x-[4px] text-neutral-800"><div><Icon name={item[0]} /></div><div className="text-paragraph-small-bold text-neutral-900">{item[1]}</div></div>
  })}</div>;
};
