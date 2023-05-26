import { Input } from '~/src/atoms/components/Input';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

function mockFunction(value: any): any {
  // console.log(value);
}

export default {
  component: Input,
  title: 'Data Handle / Input',
  args: {
    type: 'checkbox',
    id: 'recurrence',
    label: 'Set Recurrence',
    options: [
      { name: 'SUN', value: '0' },
      { name: 'MON', value: '1' },
      { name: 'TUE', value: '2' },
      { name: 'WEN', value: '3' },
      { name: 'THU', value: '4' },
      { name: 'FRI', value: '5' },
      { name: 'SAT', value: '6' }
    ]
  },
  decorators: [withDesign]
};

export const Checkbox = (args: any) => (
  <Input {...args} />
);

Checkbox.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
