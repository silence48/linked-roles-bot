import * as React from 'react';

type TimeInputProps = {
  config: any;
};

export const TimeInput: React.FC<TimeInputProps> = ({ config }: any) => {
  const {
    id,
    label,
    type,
    autoComplete,
    hidden,
    placeholder,
    defaultValue,
    required,
    mRef
  } = config;
  return (
    <>
      <div>
        <label htmlFor={id} className={ !hidden ? "block text-sm font-medium text-neutral-800" : 'hidden'}>
          {label}
        </label>
        <div className="mt-1">
          <input
            type={!hidden ? type : 'hidden'}
            name={id}
            // name="hh%3Amm"
            id={id}
            ref={mRef}
            // step="5"
            onChange={() => console.log('Changing...')}
            readOnly={hidden}
            autoComplete={autoComplete}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-neutral-200 rounded-md text-neutral-800 bg-neutral-100"
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
          />
        </div>
      </div>
    </>
  );
};