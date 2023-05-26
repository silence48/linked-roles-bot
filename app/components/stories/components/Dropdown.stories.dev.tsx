import { Dropdown, type DropdownItemsI } from '~/src/atoms/components/Dropdown';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';


const items: DropdownItemsI = [
  { text: 'Edit', type: 'button' },
  { text: 'Duplicate', type: 'button' }
];

export default {
  component: Dropdown,
  title: 'Development / Dropdown',
  argsTypes: {
    items: {
      control: 'array'
    },
    button: {
      control: 'string'
    }
  },
  args: { items, button: { icon: 'user' } },
  decorators: [withDesign]
};

export const Default = (args: any) => <Dropdown {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
