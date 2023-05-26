import React from 'react';
import { Tab as TabComponent } from '@headlessui/react';
import clsx from 'clsx';
import { Icon, type IconKeys } from '../Icon';

type TabProps = {
  orientation: 'horizontal' | 'vertical';
  options: {
    name: string;
    view: React.ComponentType;
    icon?: {
      name: IconKeys;
      color?: string;
      size?: 'small' | 'medium' | 'large';
    };
  }[];
};

export const Tab: React.FC<TabProps> = ({
  options,
  orientation = 'horizontal'
}) => {
  const [navigation] = React.useState(options);
  const listStyle = clsx(
    orientation === 'horizontal' &&
      'py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3 space-y-2',
    orientation === 'vertical' && 'flex p-1 space-x-1 bg-blue-900/20 rounded-xl'
  );
  const panelStyle = clsx(orientation === 'horizontal' && 'flex flex-1');
  const gridStyle = {
    right: clsx(
      orientation === 'horizontal' && 'space-y-6 sm:px-6 lg:px-0 lg:col-span-9'
    ),
    left: clsx(
      orientation === 'horizontal' && 'lg:grid lg:grid-cols-12 lg:gap-x-5 '
    )
  };

  const highlightPanel = clsx(
    false &&
      `bg-white rounded-xl p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60`
  );

  return (
    <>
      <div className={gridStyle.left}>
        <TabComponent.Group>
          <TabComponent.List as="aside" className={listStyle}>
            {options.map(({ name, icon }) => (
              <TabComponent
                as="nav"
                key={name}
                className={({ selected }) =>
                  clsx(
                    'text-primary border border-primary hover:text-primary-hover hover:bg-secondary-400-hover cursor-pointer group rounded-md px-3 py-2 flex items-center text-sm font-medium',
                    selected ? 'bg-secondary-400 text-background' : 'text-blue-100'
                  )
                }
              >
                {icon && (
                  <Icon name={icon.name} size="medium" customCss="mr-2" />
                )}
                {name && <span className="py-0.5 px-1">{name}</span>}
              </TabComponent>
            ))}
          </TabComponent.List>
          <div className={gridStyle.right}>
            <div className={panelStyle}>
              <TabComponent.Panels className="w-full">
                {Object.values(navigation).map((item, idx) => (
                  <TabComponent.Panel key={idx} className={highlightPanel}>
                    <item.view />
                  </TabComponent.Panel>
                ))}
              </TabComponent.Panels>
            </div>
          </div>
        </TabComponent.Group>
      </div>
    </>
  );
};
