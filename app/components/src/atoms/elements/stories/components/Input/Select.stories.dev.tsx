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
    type: 'select',
    options: [ { value: '1', name: 'desc'}],
    id: 'options',
    label: 'Select one option',
  },
  decorators: [withDesign]
};

export const Select = (args: any) => (
  <Input {...args} />
);

Select.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
