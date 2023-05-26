import * as React from 'react';
import { Popover } from '@headlessui/react';
import { Button } from '..'
import { Transition } from '@headlessui/react';
import { XIcon, ArrowsExpandIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

type SidebarProps = {
  user?: any | undefined;
  initialState: boolean;
  items?: {
    text: string;
    type: 'button' | 'link' | 'action';
    action?: () => void;
    to?: string;
    icon?: string;
  }[];
  component?: React.ElementType;
  closeSidebar?: () => void;
  showFeature?: boolean;
  children: React.ReactNode;
};

export const Sidebar: React.FC<SidebarProps> = ({ initialState = false, user, items, component: Component, closeSidebar, children }) => {
  
  const barStyle = clsx(
    'rounded-t-[12px] bg-neutral-100 p-[2px] drop-shadow border-b border-neutral-150',
  );


  return <>
    <Transition.Root show={initialState} as={React.Fragment}>
      <Transition.Child
        as={React.Fragment}
        enter="ease-out duration-500"
        enterFrom="opacity-0 translate-x-[200px]"
        enterTo="opacity-100 translate-x-[0px]"
        leave="ease-in duration-500"
        leaveFrom="opacity-100 translate-x-[0px]"
        leaveTo="opacity-0 translate-x-[200px]"
        >
          <div className={`absolute h-v92 top-0 right-0 w-[200px] bg-neutral-50 border border-neutral-200 rounded-[12px] my-[20px] mr-[20px] text-neutral-600 overflow-y-auto`}>
            <div className={barStyle}>
              <div className="flex justify-between items-center">
                <div className="flex justify-start">
                  <button
                    type="button"
                    className="bg-neutral-150 text-neutral-200 p-[2px] rounded-full hover:text-red-100 hover:bg-red-400 focus:outline-none"
                    onClick={closeSidebar}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-[8px]">
              {children}
            </div>
          </div>
      </Transition.Child>
    </Transition.Root>
  </>
}