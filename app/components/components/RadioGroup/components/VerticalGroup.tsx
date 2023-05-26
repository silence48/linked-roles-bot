import React from 'react';
import { Icon, Image, Badge } from '../../';
import { RadioGroup as RadioGroupComponent } from '@headlessui/react';
//import { motion } from "framer-motion";

type VertivcalOptions = {
  name: string;
  icon?: string;
  badge?: string;
  image_url: string;
  disabled: boolean;
}[]

type VerticalProps = {
  handleSelection: any;
  selected: { name: string; image_url: string; }
  options: VertivcalOptions
};


export const VerticalGroup: React.FC<VerticalProps> = ({ handleSelection, selected, options }) => {

  return (
    <>
    <RadioGroupComponent
        value={selected}
        onChange={(e) => handleSelection(e)}
      >
        <RadioGroupComponent.Label className="sr-only">
          Label
        </RadioGroupComponent.Label>
        <div className="flex flex-row space-x-[20px]">
          {options.map((option: any) => (
            <RadioGroupComponent.Option
              key={option.name}
              value={option}
              disabled={option.disabled}
              className={({ active, checked }) =>
                `${
                  active
                    ? 'ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60'
                    : ''
                }
                ${checked ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-50 text-neutral-800'}
                  bg-primary-400 relative rounded-lg shadow-md   ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer' } flex focus:outline-none w-[200px] overflow-hidden`
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div>
                        <RadioGroupComponent.Label
                          as="p"
                          className={`font-medium  ${checked ? 'text-neutral-800' : 'text-neutral-900'}`}
                        >
                              
                              <Image fullHeight={true} imageUrl={option.image_url} customCss={`z-[1] ${option.disabled && 'filter grayscale'}`} />
                            
                            <div className="relative h-[300px]">
                              <div className='flex flex-col justify-end w-[200px]  px-[16px] py-[20px]'>
                              <div className="flex flex-row justify-between h-6">
                                <div className="">{option.name}</div>
                                {checked && (
                                  <div className="flex-shrink-0 text-neutral-800 bg-gradient-to-tr from-primary-500 via-secondary-500 to-secondary-400 rounded-full">
                                    <CheckIcon className="w-6 h-6" />
                                  </div>
                                )}
                                {!!option.badge && (
                                  <Badge title={option.badge} />
                                )}
                              </div>
                              </div>
                            </div>
                        </RadioGroupComponent.Label>
                        <RadioGroupComponent.Description
                          as="span"
                          className={`inline ${
                            checked ? 'text-neutral-300' : 'text-neutral-600'
                          }`}
                        ></RadioGroupComponent.Description>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </RadioGroupComponent.Option>
          ))}
        </div>
      </RadioGroupComponent>
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
