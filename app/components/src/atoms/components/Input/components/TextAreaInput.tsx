import React from 'react';

type TextInputProps = {
  config: any;
};

export const TextAreaInput: React.FC<TextInputProps> = ({ config }: any) => {
  const {
    id,
    label,
    autoComplete,
    placeholder,
    defaultValue,
    maxLength = 500,
    required,
  } = config;
  const [count, setCount] = React.useState(0);
  
  return (
    <>
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-neutral-800">
          {label}
        </label>
        <div className="mt-1">
          <textarea
            id={id}
            name={id}
            rows={3}
            autoComplete={autoComplete}
            maxLength={maxLength}
            onChange={e => setCount(e.target.value.length)}
            className="resize-none shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full text-neutral-800 sm:text-sm border border-neutral-200 bg-neutral-100 rounded-md"
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
          />
        </div>
        <div className="text-primary-500">{count}/{maxLength}</div>
      </div>
    </>
  );
};