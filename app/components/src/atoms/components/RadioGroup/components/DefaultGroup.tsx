import React from 'react';
import { Icon, Image } from '../../';
import { RadioGroup as RadioGroupComponent } from '@headlessui/react';

type DefaultOptions = {
  name: string;
  icon: string;
  disabled: boolean;
}[]

type DefaultProps = {
  handleSelection: any;
  selected: { name: string; icon: string; }
  options: DefaultOptions
};


export const DefaultGroup: React.FC<DefaultProps> = ({ handleSelection, selected, options }) => {

  return (
    <>
    <div className="w-full py-[16px]">
    <div className="w-full max-w-md mx-auto">
    <RadioGroupComponent
        value={selected}
        onChange={(e) => handleSelection(e)}
      >
        <RadioGroupComponent.Label className="sr-only">
          Label
        </RadioGroupComponent.Label>
        <div className="space-y-[12px]">
          {options.map((option: any) => (
            <RadioGroupComponent.Option
              key={option.name}
              value={option}
              disabled={option.disabled}
              className={({ active, checked }) =>
                `${active
                    ? 'ring-[2px] ring-tertiary-500'
                    : `
                    hover:border-[1px] hover:border-tertiary-200
                    hover:ring-[2px] hover:ring-tertiary-500 hover:ring-offset-neutral-50
                    focus:border-[2px] focus:border-tertiary-200
                    focus:ring-[2px] focus:ring-primary-500 focus:ring-offset-neutral-50
                    `
                }
                ${checked ? 'bg-neutral-100 border-tertiary-400' : 'bg-neutral-50 text-neutral-800'}
                  relative rounded-[16px] shadow-md px-5 py-4 cursor-pointer flex outline-none
                  border-[1px]
                  `
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroupComponent.Label as="div">
                          <div className={`${active ? 'text-tertiary-500' : checked ? 'text-tertiary-400' : 'text-neutral-600'}`}>
                            <Icon name={option.icon} />
                          </div>
                          <div className={`${active ? 'text-tertiary-500' : checked ? 'text-tertiary-400' : 'text-neutral-600'}`}>{option.name}</div>
                        </RadioGroupComponent.Label>
                        <RadioGroupComponent.Description
                          as="span"
                          className={`inline ${
                            checked ? 'text-tertiary-500' : 'text-neutral-600'
                          }`}
                        ></RadioGroupComponent.Description>
                      </div>
                    </div>
                    {checked && (
                      <div className="flex-shrink-0 text-neutral-800 bg-gradient-to-tr from-primary-500 via-secondary-500 to-tertiary-500 rounded-full">
                        <CheckIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroupComponent.Option>
          ))}
        </div>
      </RadioGroupComponent>
      </div>
      </div>
    </>
  );
};

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}