import React from 'react';
import { RadioboxBasic, RadioboxFull, RadioboxCard } from './Radiobox';

type RadioboxInputProps = {
  config: any;
};

type SelectedProps = {
  value: string;
  name: string;
} | undefined

export const RadioboxInput: React.FunctionComponent<RadioboxInputProps> = ({
  config,
}) => {
  const {
    id,
    label,
    variant,
    autoComplete,
    placeholder,
    defaultValue,
    options,
    parentValue,
    afterChange,
    debug,
    required,
    type,
    mRef
  } = config;
  const [selected, setSelected] = React.useState<SelectedProps>(undefined);

  const handleUpdate = (event: any) => {
    setSelected(event);
    if (!!afterChange) {afterChange(event)}
  };

  const getRadio = ({ variant, defaultValue, options, handleUpdate, selected }: any) => {
    switch(variant) {
      case 'full':
        return <RadioboxFull selected={selected} handleUpdate={handleUpdate} options={options} />;
      case 'card':
        return <RadioboxCard selected={selected} handleUpdate={handleUpdate} options={options} />;
      default:
        return <RadioboxBasic selected={selected} handleUpdate={handleUpdate} options={options} />
    }
  }

  React.useEffect(() => {
    setSelected(!!defaultValue ? options.find(({ id }: any) => id === defaultValue) : options[0])
    if (!!afterChange) { afterChange(options[0]) }
  }, [parentValue])

  return (
      <div>
      <label className="block text-sm font-medium text-neutral-900">{label}</label>
      <input hidden={debug ? !debug : true} value={selected?.value} readOnly autoComplete='off' name={id} id={id} ref={mRef} />
      <fieldset className="mt-4">
        {getRadio({ variant, defaultValue, options, handleUpdate, selected })}
      </fieldset>
    </div>
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