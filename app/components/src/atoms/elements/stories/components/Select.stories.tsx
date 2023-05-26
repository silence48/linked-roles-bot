import { Select } from '~/src/atoms/components/Select';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

function fn(value: any): any {
  // console.log(value);
}

const options = [
  { name: 'Wade Cooper', id: '1' },
  { name: 'Arlene Mccoy', id: '2' },
  { name: 'Devon Webb', id: '3' },
  { name: 'Tom Cook', id: '4' },
  { name: 'Tanya Fox', id: '5' },
  { name: 'Hellen Schmidt', id: '6' }
];

export default {
  component: Select,
  title: 'Data Handle / Select',
  argsTypes: {
    initialState: {
      control: 'array'
    }
  },
  args: {
    options: options,
    defaultValue: 'Arlene Mccoy'
  },
  decorators: [withDesign]
};

export const Default = (args: any) => (
  <Select {...args} register={fn} setValue={fn} />
);

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
