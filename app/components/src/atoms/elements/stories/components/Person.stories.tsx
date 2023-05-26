import { Person } from '~/src/atoms/components/Person';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: Person,
  title: 'Compositions / Person',
  argTypes: {
    imageUrl: {
      type: {
        summary: 'string'
      },
      defaultValue:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
    },
    fullname: {
      type: {
        summary: 'string'
      },
      defaultValue:
        'Julián Clatro'
    },
    details: {
      type: {
        summary: 'string'
      },
      defaultValue:
        'Front end Dev'
    },
    variant: {
      type: {
        summary: 'string'
      },
      defaultValue:
        'default'
    }
  },
  decorators: [withDesign]
};

export const Default = (args: any) => <Person {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=971%3A68'
  }
};
