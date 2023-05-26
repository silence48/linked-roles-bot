import * as React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

type SelectProps = {
  type: 'action' | 'input';
  id: string;
  defaultValue: string;
  debug: boolean;
  parentValue?: string;
  options: { name: string; description: string, value: string }[];
  afterUpdate?: (e: any) => void;
  mRef?: React.RefObject<HTMLInputElement>;
  multiple?: boolean;
};
export const Select: React.FunctionComponent<SelectProps> = ({
  type = 'action',
  id,
  defaultValue,
  debug,
  options,
  afterUpdate,
  mRef,
  multiple = false
}) => {
  const [selected, setSelected] = React.useState(defaultValue ? options.find(({ value }) => String(value)  === String(defaultValue)) : options[0]);

  React.useEffect(() => {
    const value = defaultValue ? options.find(({ value }) => String(value) === String(defaultValue)) : options[0]
    setSelected(value)
    if (!!afterUpdate) { afterUpdate(value)}
  }, [defaultValue])

  const handleUpdate = (event: any) => {
    console.log('event',event)
    setSelected(event);
    if (!!afterUpdate) { afterUpdate(event)}
  };

  return (
    <>
      {/* {type === 'input' && <input hidden={debug ? !debug : true} value={selected?.value} readOnly autoComplete='off' name={id} id={id} ref={mRef} />} */}
      <Listbox value={selected} onChange={(e) => handleUpdate(e)} multiple={multiple}>
      {({ open }) => (
        <div className="relative mt-1">
          <Listbox.Button className={`${!!open ? 'bg-neutral-50' : 'bg-neutral-100 border-neutral-200'} relative w-full shadow-sm py-2 pl-3 pr-10 text-left text-neutral-800 rounded-md cursor-default open:bg-neutral-50 active:ring-1 active:ring-offset-1 active:ring-blue-500 sm:text-sm border`}>
            <span className="block truncate">{selected?.name} { !selected && 'Select your option'}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-primary"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={React.Fragment}
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-neutral-100 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50 py-[8px] border border-neutral-200">
              {Array.isArray(options) && options.map((item) => (
                <Listbox.Option
                  key={item.value}
                  className={({ active }) =>
                    `${
                      active
                        ? 'text-neutral-600 font-bold bg-primary-300'
                        : 'text-neutral-800'
                    }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active && 'text-neutral-600'
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>)}
      </Listbox>
    </>
  );
};
