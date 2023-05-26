import { GroupItems } from '~/src/atoms/components/GroupItems';
import { Button } from '~/src/atoms/components/Button';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: GroupItems,
  title: 'Composes / GroupItems',
  argTypes: {
    items: {
      type: {
        summary: 'array'
      },
      defaultValue: [[
        'cogwheel',
        'a Description'
      ], [
        'cogwheel',
        'another Description'
      ], [
        'cogwheel',
        'other Description'
      ]]
    },
  },
  decorators: [withDesign]
};

export const Default = (args: any) => { return <GroupItems {...args} />};

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/OG2qkuEFEhNmf2wTA0wAGq/Design-System?node-id=754%3A6702'
  }
};
