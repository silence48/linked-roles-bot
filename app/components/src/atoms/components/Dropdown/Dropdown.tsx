import { Menu, Transition } from '@headlessui/react';
import { Button } from '..';
import React, { Fragment } from 'react';
import { type IconKeys } from '../Icon';

export type DropdownItemsI = {
  text: string;
  type: 'button' | 'link' | 'action';
  action?: () => void;
  to?: string;
  icon?: IconKeys;
}[];

type DropdownProps = {
  children?: React.ReactNode;
  component?: React.ElementType;
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
  items: DropdownItemsI
};

export const Dropdown: React.FC<DropdownProps> = ({
  component: Component,
  children,
  button,
  items
}) => {
  const { icon, size } = button;
  // Add Color to Icon
  // const iconName = icon ? { name: icon, size } : undefined;
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Button
          type="menu"
          size={size}
          {...button}
          icon={icon}
        />
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
            className="absolute right-0 w-56 mt-2 origin-top-right border border-neutral-400 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
            <div className="relative p-[8px]">
              <div className="absolute top-0 bottom-0 right-0 left-0 rounded-md backdrop-blur-md bg-gradient-to-br from-neutral-50 to-background opacity-[0.98] z-[-1]"
              ></div>
              <div>
              {items.map(({ text, type, to, action, icon }, key) => {
                return (
                  <div key={key}>
                    <Menu.Item as="div">
                      {({ active }) => (
                        <>
                          {type === 'button' && (
                            <Button
                              text={text}
                              type={type}
                              variant="dropdown"
                              active={active}
                              icon={icon}
                              onClick={action}
                            />
                          )}
                          {type === 'action' && (
                            <Button
                              text={text}
                              type={type}
                              to={to}
                              variant="dropdown"
                              active={active}
                              icon={icon}
                            />
                          )}
                          {type === 'link' && !!Component && (
                            <Button
                              text={text}
                              type="link"
                              variant="dropdown"
                              icon={icon}
                              to={to}
                              active={active}
                              component={Component}
                            />
                          )}
                        </>
                      )}
                    </Menu.Item>
                  </div>
                );
              })}
              </div>
              
            </div>
          
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
