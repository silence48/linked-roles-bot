import React from 'react';
import { Switch as SwitchComponent } from '@headlessui/react';

type SwitchProps = {
  onChange: () => void;
};

export const Switch: React.FunctionComponent<SwitchProps> = ({ onChange }) => {
  const [enabled, setEnabled] = React.useState(false);

  const toggleAction = () => {
    setEnabled(!enabled);
    onChange();
  };

  return (
    <SwitchComponent
      checked={enabled}
      onChange={toggleAction}
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex items-center h-6 rounded-full w-11`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full`}
      />
    </SwitchComponent>
  );
};
