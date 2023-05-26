import React from 'react';
import clsx from 'clsx';
import { Disclosure as DisclosureComponent } from '@headlessui/react';
import { Icon } from '..';

type DisclosureProps = {
  items: { title: string; text: string }[];
};

export const Disclosure: React.FunctionComponent<DisclosureProps> = ({
  items
}) => {
  const style = clsx('flex flex-col space-y-[20px] w-full');
  return (
    <div className={style}>
      {items.map(({ title, text }, key) => {
        return (
          <DisclosureComponent key={key}>
            {({ open }) => (
              <>
                <DisclosureComponent.Button className="w-full py-[15px] px-[30px] text-h4-normal-semi-bold text-neutral-800 border rounded-[4px] border-neutral-150">
                  <div className="flex justify-between">
                  <div>{title}</div>
                  <div className={`${!!open && 'rotate-180'}`}><Icon name="shootingArrowRight" size="xlarge" /></div>
                  </div>
                  <div>
                    <DisclosureComponent.Panel className="pt-4 pb-2 text-left text-paragraph-large-medium text-neutral-500">
                      {text}
                    </DisclosureComponent.Panel>
                  </div>
                </DisclosureComponent.Button>
              </>
            )}
          </DisclosureComponent>
        );
      })}
    </div>
  );
};
