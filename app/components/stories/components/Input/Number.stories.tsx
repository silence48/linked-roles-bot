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
    type: 'email',
    id: 'email',
    label: 'Email',
    placeholder: 'example@email.com'
  },
  decorators: [withDesign]
};

export const Number = (args: any) => (
  <Input {...args} />
);

Number.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
