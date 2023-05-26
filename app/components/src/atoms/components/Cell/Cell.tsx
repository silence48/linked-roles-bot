// Cells are List and Table child components for displaying data.

import React from 'react';
import { Button, Dropdown, Person } from '..'
type CellProps = {
  value: string | { text: string, to: string } | { text: string, imageUrl: string } | { text:string, content: any, onClick?: any } | any;
  type:
    | 'simple'
    | 'link'
    | 'description'
    | 'extended'
    | 'button'
    | 'badge'
    | 'icon'
    | 'dropdown'
    | 'person'
    | 'image';
  component?: React.ElementType
};

// type DropdownItemsI = {
//   title: string;
//   type: 'button' | 'link';
//   action?: () => void;
//   to?: string;
// }[];


export const Cell: React.FC<CellProps> = ({ type, value, component: Component }) => {
  const handleClick = () => {
    // runSound()
    if (type === 'button') value?.onClick(value?.content);
  };

  const cellAssert = (type: string, value: string | { text: string, to: string } | any) => {  
    switch (type) {
      case 'simple':
        return <div className="text-paragraph-small-medium px-6 py-4">{value}</div>;
      case 'person':
        return <div className="px-[16px]"><Person imageUrl={value.avatar_url} fullname={value.first_name} /></div>

      case 'description':
        return (
          <div className='px-6 py-4'>
            <div className="text-sm text-neutral-800">{value.title}</div>
            <div className="text-sm text-neutral-500">{value.description}</div>
          </div>
        );
      case 'extended':
        return (
          <div className="flex items-center px-6 py-4">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full"
                src={value.imageUrl}
                alt=""
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-800">
                {value.title}
              </div>
              <div className="text-sm text-neutral-500">{value.description}</div>
            </div>
          </div>
        );
      case 'button':
        return <><Button size="tiny" text={value.text} onClick={() => handleClick()}/></>;
      case 'link':
        if (!!Component)
        return <Component to={value.to}>{value.text}</Component>;
      case 'badge':
        return <></>;
      case 'icon':
        return <></>;
      case 'dropdown':
        return (
          <div className="">
            <Dropdown
              button={{ icon: 'dots', size: 'small', variant: 'basic' }}
              items={value}
              component={Component}
            />
          </div>
        );
      case 'image':
        return (
          <div className="flex h-[64px] px-6 py-4"style={{ backgroundImage: `linear-gradient(to left, rgba(44, 51, 53, 1), rgba(44, 51, 53, 0.5), rgba(44, 51, 53, 0.5), rgba(44, 51, 53, 0.2)), url('${value.imageUrl}')`, backgroundSize: 'cover'}} >
            {value.text}
          </div>
        );
      default:
        return <></>;
    }
  };
  return cellAssert(type, value)
};
