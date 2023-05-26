import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Button, Icon } from '../../';
import { Fragment } from 'react';
import { DateTime } from 'luxon'
import { formatISO, startOfDay } from 'date-fns';

type PickerInputProps = {
  component: React.ElementType,
  config: any;
};

type ValueProps = {
  name: string;
  value: string;
} | undefined
export const PickerInput: React.FC<PickerInputProps> = ({
  component: Component,
  config
}: any) => {
  const {
    id,
    type,
    style,
    label,
    icon,
    autoComplete,
    placeholder,
    defaultValue,
    uploadFile,
    hidden,
    debug,
    options,
    required,
    mRef
  } = config;
  const [data, setData] = React.useState<ValueProps>(undefined);

  // !!defaultValue ? (typeof defaultValue === 'number' ? new Date(defaultValue) : defaultValue) : new Date()
  // const [date, setDate] = React.useState<Date>(!!defaultValue ? (typeof defaultValue === 'number' ? new Date(defaultValue) : defaultValue) : new Date());

  const handleChange = (data: any) => {
    setData(data);
  };
  React.useEffect(() => {
    if (!!defaultValue) {
      if (type === 'datepicker') {
        // console.log('defaultValue', defaultValue.length)
        const date: any = DateTime.fromSeconds(defaultValue / 1000).startOf('day')
        const v = +new Date(date.toISO())/ 1000
        return setData({name: `${date.weekdayShort} ${date.day} ${date.monthLong}`, value: v.toString()});

      }
      // if (type === 'timepicker') return setData({name: startOfDay(defaultValue).toString(), value: formatISO(defaultValue, { representation: 'date' })});
    } else {
      if (type === 'datepicker') {
        const date: any = DateTime.fromJSDate(new Date).startOf('day')
        const v = +new Date(date.toISO())/ 1000
        return setData({name: `${date.weekdayShort} ${date.day} ${date.monthLong}`, value: v.toString()});

      }
      
    }
  }, [defaultValue])
  
  // console.log("icon", icon)
  // +new Date(startOfDay(date).toString())
  return (
    <>
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-neutral-800">
          {label}
        </label>
        <input type="text" value={data?.value ? data?.value : undefined} hidden={debug? !debug : true} readOnly autoComplete='off' name={id} id={id} ref={mRef} />
        <Popover className="relative mt-1">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                border border-neutral-200 relative w-full shadow-sm py-2 pl-3 pr-10 text-left text-neutral-800 bg-neutral-100 cursor-pointer sm:text-sm ${
                  !open ? 'rounded-[6px]' : 'rounded-[6px]'
                }`}
              >
                <span
                  className={`absolute inset-y-0 left-0 pl-2 flex items-center ${
                    !open ? 'text-neutral-800' : 'text-primary-400'
                  }`}
                >
                  <Icon name={icon} />
                </span>
                <span className="pl-7 pr-12">
                  {data?.name}
                </span>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Popover.Panel className="absolute z-50 w-full">
                  <div className="overflow-hidden">
                    <div className="absolute bg-neutral-100 mt-[8px] p-[16px] rounded-[12px] border  w-full">
                      <Component value={data?.value} handleChange={handleChange} defaultValue={defaultValue} close={close} />
                      <Popover.Button
                        onClick={() => close()}
                        className="w-full"
                      >
                        <Button text="Close" size="tiny" variant="outline" as="div" customCss="w-full mt-4" />
                      </Popover.Button>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </>
  );
};
