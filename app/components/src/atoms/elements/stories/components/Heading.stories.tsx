import { Heading } from '~/src/atoms/components/Heading';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: Heading,
  title: 'Components / Heading',
  args: {
    section: { title: 'Heading' }
  },
  argTypes: {
    section: {
      title: {
        type: {
          summary: 'string'
        }
      }
    }
  },
  decorators: [withDesign]
};

export const Default = (args: any) => <Heading {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
