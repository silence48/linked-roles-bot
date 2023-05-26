import * as React from 'react';
import { useForm } from '../../Form/context';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import { Icon } from '../..'
type DefaultInputProps = {
  config: any;
};

export const DefaultInput: React.FC<DefaultInputProps> = ({ config }: any) => {
  const {
    id,
    label,
    type,
    disabled,
    autoComplete,
    hidden,
    placeholder,
    afterChange,
    validation,
    defaultValue,
    required,
    mRef
  } = config;
  const [ status, setStatus ] = React.useState<'EMPTY' | 'VALID' | 'ERROR'>('EMPTY')
  const { updateForm } = useForm();
  const [ value, setValue ] = React.useState(defaultValue)
  
  const validate =  async (event: any) => {
    setValue(event)
    updateForm()
    const e = await validation?.fn(event)
    if (e.valid === true) {
      setStatus('VALID')
      afterChange({ id, value: event, type, label, status: 'VALID', message: e.message})
    } else if (e.valid === false) {
      setStatus('ERROR')
      afterChange({ id, value: event, type, label, status: 'ERROR', message: e.message})
    }
  }
  
  return (
    <>
      <div>
        <label htmlFor={id} className={ !hidden ? "block text-sm font-medium text-neutral-800" : 'hidden'}>
          {label}
        </label>
        <div className="mt-1">
          <input
            disabled={disabled}
            type={!hidden ? type : 'hidden'}
            name={id}
            id={id}
            ref={mRef}
            onChange={(e) => validate(e.target.value)}
            readOnly={hidden}
            autoComplete={autoComplete}
            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-neutral-200 rounded-md text-neutral-800 bg-neutral-100 ${disabled && 'text-neutral-300 cursor-not-allowed'}`}
            placeholder={placeholder}
            required={required}
          />
        </div>
      </div>
    </>
  );
};