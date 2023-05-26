import { Popover as PopoverComponent, Transition } from '@headlessui/react';
import React, { FunctionComponent, Fragment } from 'react';
import { Button } from '../'
import { type IconKeys } from '../Icon';

type PopoverProps = {
  button: {
    name?: string;
    icon?: IconKeys;
    size?: 'tiny' | 'small' | 'medium' | 'large';
    variant?:
    | 'primary'
    | 'secondary'
    | 'basic'
    | 'outline'
    | 'alert'
    | 'warning'
    | 'positive'
    | 'dropdown';
    rounded?: 'small' | 'medium' | 'full';
  };
  children?: React.ReactNode
};

export const Popover: FunctionComponent<PopoverProps> = ({ children, button }) => {
  const { icon, size, name } = button;

  return (
    <div className="">
      <PopoverComponent className="relative">
        {({ open }) => (
          <>
            <div>
              <Button
                type="popover"
                size={size}
                text={name}
                {...button}
                icon={icon}
              />
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverComponent.Panel className="absolute right-0 w-[300px] mt-2 origin-top-right border border-neutral-200 rounded-[10px] z-50">
                <div className="overflow-hidden rounded-[10px] shadow-lg">
                  <div className="relative bg-neutral-50">
                    {children}
                  </div>
                </div>
              </PopoverComponent.Panel>
            </Transition>
          </>
        )}
      </PopoverComponent>
    </div>
  );
};
