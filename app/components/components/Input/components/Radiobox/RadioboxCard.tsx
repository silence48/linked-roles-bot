import React from 'react';
import clsx from 'clsx'
import { RadioGroup } from '@headlessui/react'

type RadioboxCardProps = {
  options: any;
  selected: any;
  handleUpdate: any;
};

export const RadioboxCard: React.FunctionComponent<RadioboxCardProps> = ({
  options,
  selected,
  handleUpdate,
}) => {
  return (
    <RadioGroup value={selected} onChange={handleUpdate} className="mt-2">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {options.map((item: any) => (
          <RadioGroup.Option
            key={item.name}
            value={item}
            className={({ active, checked }) =>
              clsx(
                active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                checked
                  ? 'border-primary-400 border-transparent text-neutral-800 hover:bg-indigo-700'
                  : ' border-neutral-200 text-neutral-600 hover:bg-gray-50',
                'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
              )
            }
          >
            <RadioGroup.Label as="span">{item.name}</RadioGroup.Label>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};