import React from 'react';
import clsx from 'clsx'
import { RadioGroup } from '@headlessui/react'

type RadioboxBasic = {
  options: any;
  selected: any;
  handleUpdate: any;
};

export const RadioboxBasic: React.FunctionComponent<RadioboxBasic> = ({
  options,
  selected,
  handleUpdate,
}) => {

  return (
      <RadioGroup value={selected} onChange={handleUpdate}>
      <div className="space-y-4">
          {options.map((item: any) => (
            <RadioGroup.Option
            key={item.name}
            value={item}
            className={({ checked }) => clsx('relative flex cursor-pointer focus:outline-none')}
          >
            {({ active, checked }) => (
              <>
                <span
                  className={clsx(
                    checked ? 'bg-primary-400' : 'border-gray-300',
                    active ? 'ring-2 ring-offset-2 ring-primary-500' : '',
                    'h-4 w-4 mt-0.5 cursor-pointer shrink-0 rounded-full border flex items-center justify-center'
                  )}
                  aria-hidden="true"
                >
                  <span className="rounded-full w-1.5 h-1.5" />
                </span>
                <span className="ml-3 flex flex-col">
                  <RadioGroup.Label
                    as="span"
                    className={clsx(checked ? 'text-primary-900' : 'text-neutral-900', 'ml-3 block text-sm font-medium text-neutral-700')}
                  >
                    {item.name}
                  </RadioGroup.Label>
                </span>
              </>
            )}
          </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
  );
};


// <RadioGroup value={selected} onChange={handleUpdate}>
//       <div className="space-y-4">
//         {options.map((item: any) => (
//             <div key={item.id} className="flex items-center">
//               <input
//                 name='radioGroup'
//                 type="radio"
//                 checked={selected?.id === item.id}
//                 onChange={() => handleUpdate(item)}
//                 className="focus:ring-primary-400 h-4 w-4 text-primary-300 border-neutral-300"
//               />
//               <label htmlFor={item.id} className="ml-3 block text-sm font-medium text-neutral-700">
//                 {item.name}
//               </label>
//             </div>
//           ))}
//         </div>
//       </RadioGroup>