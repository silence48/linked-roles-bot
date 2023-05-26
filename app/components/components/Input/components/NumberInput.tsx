import{ useForm } from '../../Form/context/Form'
import * as React from 'react';
import clsx from 'clsx'
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import { Icon } from '../..'
type NumberInputProps = {
  config: any;
};

export const NumberInput: React.FC<NumberInputProps> = ({ config }: any) => {
  const {
    id,
    label,
    type,
    autoComplete,
    hidden,
    placeholder,
    afterChange,
    defaultValue,
    required,
    validation,
    disabled,
    icon,
    mRef
  } = config;
  const [ status, setStatus ] = React.useState<'EMPTY' | 'VALID' | 'ERROR'>('EMPTY')
  const [ value, setValue ] = React.useState(defaultValue)
  const { updateForm } = useForm();

  React.useEffect(() => {
    if(defaultValue) {
      setValue(defaultValue)
    }
  }, [defaultValue])

  const validate =  async (event: any) => {
    const newValue = event()
    if(newValue) {
      setValue(newValue)
      const e = await validation?.fn(newValue)
      updateForm()
      if (e.valid === true) {
        setStatus('VALID')
        afterChange({ id, value, type, label, status: 'VALID', message: e.message})
      } else if (e.valid === false) {
        setStatus('ERROR')
        afterChange({ id, value, type, label, status: 'ERROR', message: e.message})
      }
    }
  }
  
  const inputStyle = clsx(`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-neutral-200 rounded-md text-neutral-800 bg-neutral-100`,
    status === 'VALID' && 'border-green-400 focus:ring-green-500 focus:border-green-500',
    status === 'ERROR' && 'border-red-400 focus:ring-red-500 focus:border-red-500',
    !!icon && 'pl-10'
  )

  const iconStyle = clsx('absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400',
    status === 'VALID' && 'text-green-400',
    status === 'ERROR' && 'text-red-400',
  )

  const iconStatus = (status: 'VALID' | 'ERROR' | 'EMPTY') => {
    switch(status) {
      case 'VALID': return <CheckIcon className="w-[20px] h-[20px]"/>
      case 'ERROR': return <XIcon className="w-[20px] h-[20px]"/>
      default: return <div className="origin-center animate-spin"><Icon name="spinner" /></div>
    }
  }

  return (
    <>
      <div>
        <label htmlFor={id} className={ !hidden ? "block text-sm font-medium text-neutral-800" : 'hidden'}>
          {label}
        </label>
        <div className="mt-1 relative">
          <input
            type={!hidden ? 'text' : 'hidden'}
            disabled={disabled}
            name={id}
            id={id}
            ref={mRef}
            value={value}
            pattern="[0-9]*"
            readOnly={hidden}
            onChange={(e) => validate((v: any) => (e.target.validity.valid ? e.target.value : v))}
            autoComplete={autoComplete}
            className={inputStyle}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
          />
        { !!icon && !hidden &&
          <div  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-800">
            <Icon name={icon}/>
          </div>
        }

        {status !== 'EMPTY' && !hidden &&
          <div className={iconStyle}>
            {iconStatus(status)}
          </div>
        }
        </div>
      </div>
    </>
  );
};
