import { Popover as TooltipComponent, Transition } from '@headlessui/react';
import React, { FunctionComponent, Fragment } from 'react';
import { Button } from '..'
import { Float } from '@headlessui-float/react'
import { type IconKeys} from '../Icon';

type TooltipProps = {
  button: {
    name?: string;
    icon?: IconKeys | undefined;
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

export const Tooltip: FunctionComponent<TooltipProps> = ({ children, button }) => {
  const { icon, size, name } = button;

  return (
    <>
      <TooltipComponent>
      <Float
          placement="bottom-start"
          offset={15}
          shift={6}
          flip={10}
          arrow
          portal
          enter="transition duration-200 ease-out"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition duration-150 ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <TooltipComponent.Button className="outline-none">
            <Button
              as="div"
              size={size}
              text={name}
              icon={icon}
              {...button}
            />
          </TooltipComponent.Button>

          <TooltipComponent.Panel className="w-[240px] h-[70px] bg-neutral-150 border border-neutral-150 rounded-[8px] shadow-lg focus:outline-none">
            <Float.Arrow className="absolute bg-neutral-100 w-5 h-5 rotate-45 border border-neutral-150" />
            <div className="relative h-full bg-neutral-100 p-3 text-neutral-800 rounded-[7px]">
              {children}
            </div>
          </TooltipComponent.Panel>
        </Float>
      </TooltipComponent>
    </>
  );
};
