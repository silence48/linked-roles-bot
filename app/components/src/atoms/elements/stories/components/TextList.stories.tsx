import { TextList } from '~/src/atoms/components/TextList';
import { Button } from '~/src/atoms/components/Button';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: TextList,
  title: 'Compositions / TextList',
  argTypes: {
    items: {
      type: {
        summary: 'array'
      },
      defaultValue: [[
        'a Title',
        'a Description'
      ], [
        'another Title',
        'another Description'
      ], [
        'other Title',
        'other Description'
      ]]
    },
  },
  decorators: [withDesign]
};

export const Default = (args: any) => { return <TextList {...args} />};

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/OG2qkuEFEhNmf2wTA0wAGq/Design-System?node-id=754%3A6702'
  }
};
