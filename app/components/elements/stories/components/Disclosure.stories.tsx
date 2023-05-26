import { Disclosure } from '~/src/atoms/components/Disclosure';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

type ItemsI = {
  title: string;
  text: string;
}[];

const items: ItemsI = [
  { title: 'About us', text: 'We are ...' },
  { title: 'How we work', text: 'Learn more ...' }
];

export default {
  component: Disclosure,
  title: 'Components / Disclosure',
  decorators: [withDesign],
  argsTypes: {
    items: {
      control: 'array'
    }
  },
  args: { items }
};

export const Default = (args: any) => <Disclosure {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
