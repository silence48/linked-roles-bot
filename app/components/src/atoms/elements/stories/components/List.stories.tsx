import { List } from '~/src/atoms/components/List';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: List,
  title: 'Data Show / List',
  decorators: [withDesign]
};

const data = [
  [
    {
      value: {
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        title: 'Name'
      },
      type: 'extended'
    },
    {
      value: [
        { title: 'Edit', type: 'button' },
        { title: 'Duplicate', type: 'button' }
      ],
      type: 'dropdown'
    }
  ]
];

export const Default = (args: any) => <List {...args} data={data} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=971%3A68'
  }
};
