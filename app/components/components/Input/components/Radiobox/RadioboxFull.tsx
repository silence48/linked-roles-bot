import React from 'react';
import clsx from 'clsx'
import { RadioGroup } from '@headlessui/react'

type RadioboxFullProps = {
  options: any;
  selected: any;
  handleUpdate: any;
};

export const RadioboxFull: React.FunctionComponent<RadioboxFullProps> = ({
  options,
  selected,
  handleUpdate,
}) => {

  // console.log('selected', selected)
  return (
    <RadioGroup value={selected} onChange={handleUpdate}>
      <div className="space-y-4">
          {options.map((item: any) => (
            <RadioGroup.Option
            key={item.name}
            value={item}
            className={({ checked }) =>
              clsx(
                // itemIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                // itemIdx === items.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                checked ? 'z-10' : 'border-neutral-200',
                'relative border p-4 flex cursor-pointer focus:outline-none rounded-[8px]'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span
                  className={clsx(
                    checked ? 'bg-primary-400 border-transparent' : 'border-neutral-300',
                    active ? 'ring-2 ring-offset-2 ring-primary-300' : '',
                    'h-4 w-4 mt-0.5 cursor-pointer shrink-0 rounded-full border flex items-center justify-center'
                  )}
                  aria-hidden="true"
                >
                  <span className="rounded-full bg-white w-1.5 h-1.5" />
                </span>
                <span className="ml-3 flex flex-col">
                  <RadioGroup.Label
                    as="span"
                    className={clsx(checked ? 'text-primary-400' : 'text-neutral-900', 'block text-sm font-medium')}
                  >
                    {item.name}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="span"
                    className={clsx(checked ? 'text-primary-300' : 'text-neutral-500', 'block text-sm')}
                  >
                    {item.description}
                  </RadioGroup.Description>
                </span>
              </>
            )}
          </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
  );
};