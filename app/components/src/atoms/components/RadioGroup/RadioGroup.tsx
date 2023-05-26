import React from 'react';
import { useState } from 'react';
import { DefaultGroup, VerticalGroup } from './components'

// import { iconAssert } from 'components/Icon/Icon';

type RadioGroupProps = {
  options: any
  variant: 'horizontal' | 'vertical'
  setValue?: any;
};

export const RadioGroup: React.FunctionComponent<RadioGroupProps> = ({
  options,
  variant = 'horizontal',
  setValue
}) => {
  const [selected, setSelected] = useState(options[0]);

  const handleSelection = (value: any) => {
    setValue && setValue(value);
    setSelected(value);
  };

  return (
    <>
    <>
        {variant === 'horizontal' && <DefaultGroup handleSelection={handleSelection} options={options} selected={selected} />}
        {variant === 'vertical' && <VerticalGroup handleSelection={handleSelection} options={options} selected={selected} />}
      </>
    </>
  );
};
