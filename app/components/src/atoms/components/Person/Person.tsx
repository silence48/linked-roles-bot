import React from 'react';
// import clsx from 'clsx';
import { Avatar } from '../Avatar';

type PersonProps = {
  imageUrl: string;
  fullname?: string;
  details?: string;
  variant?: 'default' | 'landscape' | 'lab' | 'profile' | 'card';
  component?: React.ElementType;
  to?: string;
  customCss?: string;
};

export const Person: React.FC<PersonProps> = ({
  component: Component,
  imageUrl,
  fullname,
  details,
  variant = 'default',
  to,
  customCss
}) => {
  
  const variantAssert = () => {

    switch (variant) {
      case 'landscape':
        return  <div className="flex flex-col space-y-[8px] m-[8px] w-fit">
        <div className="mx-auto">
          <Avatar imageUrl={imageUrl} size="tiny"/>
        </div>
        <div>
          <span className="text-paragraph-small-bold text-neutral-800">{fullname}</span>
        </div>
      </div>
      case 'lab':
        return <div className="flex space-x-[16px] m-[8px] w-fit">
        <div>
          <Avatar imageUrl={imageUrl} size="medium"/>
        </div>
        <div className="flex flex-col-reverse">
          <div>
            <div className="text-paragraph-medium-bold text-neutral-800">{fullname}</div>
            <div className="text-caption-bold text-primary-500">{details}</div>
          </div>
        </div>
      </div>
      case 'profile':
        return <div className="flex space-x-[16px] m-[8px] h-fit w-fit">
        <div>
          <Avatar imageUrl={imageUrl} size="medium"/>
        </div>
        <div className="grid content-center">
            <div className="text-paragraph-medium-bold text-neutral-800">{fullname}</div>
            <div className="text-caption-bold text-primary-500">{details}</div>
        </div>
        </div>
      case 'card':
        return  <div className="flex space-x-[8px] w-fit"> 
        <Avatar imageUrl={imageUrl} size="xtiny"/>
        <div>
          <div className="mt-[2px] text-paragraph-small-bold text-neutral-800 align-middle">{fullname}</div>
        </div>
      </div>
      default:
        return  <div className="flex space-x-4 w-fit"> 
        <Avatar imageUrl={imageUrl} size="tiny"/>
        <div>
          <div className="mt-[5px] text-paragraph-small-bold text-neutral-800 align-middle">{fullname}</div>
        </div>
      </div>
    }
  }
  switch (typeof to) {
    case 'string':
      if (!!Component)
      return <Component to={`/${to}`}>{variantAssert()}</Component>;
    default:
      return variantAssert()
  }
};
