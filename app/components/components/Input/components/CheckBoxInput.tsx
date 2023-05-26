import React from 'react';

type CheckBoxInputProps = {
  config: any;
};

export const CheckBoxInput: React.FC<CheckBoxInputProps> = ({
  config
}: any) => {
  const {
    id,
    label,
    autoComplete,
    placeholder,
    defaultValue,
    options,
    debug,
    required,
    type,
    mRef
  } = config;
  const [list, setList] = React.useState(
    options.map((obj: any) => ({ ...obj, active: false }))
  );
  const [ value, setValue] = React.useState('');

  React.useEffect(() => {
    updateValue();
  }, []);

  const updateValue = () => {
    const newList: any = [];
    list.map((item: any) => {
      if (item.active === true) {
        newList.push(item.value);
      }
    });
    setValue(newList.toString());
  };
  const handleUpdate = (data: any) => {
    list[data.value].active = !list[data.value].active;
    setList([...list]);
    updateValue();
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-800">
          {label}
      </label>
      <input hidden={debug ? !debug : true} value={value} readOnly autoComplete='off' name={id} id={id} ref={mRef} />
      <div className="mt-1 flex flex-wrap w-full border border-neutral-100 space-x-2 text-center p-1.5 rounded-md bg-neutral-100 text-xs">
        {list.map((item: any, key: string) => {
          return (
            <div
              key={key}
              className={`flex-1 p-1 rounded-md cursor-pointer ${
                item.active
                  ? 'bg-secondary-400 text-secondary-100 font-bold'
                  : 'bg-neutral-100 text-neutral-800'
              }`}
              onClick={() => handleUpdate(item)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
