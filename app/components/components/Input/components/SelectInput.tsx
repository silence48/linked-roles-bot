import React from 'react';
import { Select } from '../../Select';
import { useForm } from '../../Form/context';

type SelectInputProps = {
  config: any;
};

export const SelectInput: React.FC<SelectInputProps> = ({
  config
}: any) => {
  const{ updateForm } = useForm();
  const { id, label, defaultValue, options, required, debug, mRef, belongs_to, populateOptions, multiple, hidden  } = config;
  const [ value, setValue] = React.useState(defaultValue)

  React.useEffect(() => {
    // Check if parent options has changed
    const hasValue = options.find((option: any) => `${option.value}` === value)
    if (!hasValue && options.length > 0) {
      setValue(options[0].value)
    }
  }, [options])

  const handleChange = (e: any) => {
    if (e?.value) {
      setValue(`${e.value}`)
      updateForm()
    }
  }

  return (
    <>
        { !hidden &&
          <label htmlFor={id} className="block text-sm font-medium text-neutral-800">
            {label}
          </label>
        }
        <input hidden={hidden ? true : !debug ? true : false} value={value} readOnly autoComplete='off' name={id} id={id} />
        { !hidden && 
          <Select
            type="input"
            id={id}
            mRef={mRef}
            afterUpdate={handleChange}
            defaultValue={value}
            debug={debug}
            options={options ? options : []}
            multiple={multiple}
          />
        }
    </>
  );
};
