import React from 'react';
import { Cell } from '../Cell';

type ListProps = {
  data: [
    {
      value: string | { text: string, to: string } | any;
      type:
        | 'badge'
        | 'link'
        | 'button'
        | 'simple'
        | 'extended'
        | 'description'
        | 'dropdown'
        | 'image';
    }
  ][];
  background?: 'default' | 'light';
  component: React.ElementType
};

export const List: React.FC<ListProps> = ({ data, component, background = 'default'}) => {
  return (
    <div className={`text-paragraph-medium-medium text-neutral-800 shadow sm:rounded-[20px] ${background === 'default' ? 'bg-neutral-100' : 'bg-neutral-150'} overflow-hidden` }>
      <ul role="list" className="divide-y divide-neutral-50">
        {data.map((row, key) => (
          <li key={key} className="">
            <div className="flex items-center justify-between last:pr-[16px]">
              {row.map((item, key) => {
                return (
                  <div key={key} className="">
                    <Cell value={item.value} type={item.type} component={component}/>
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
