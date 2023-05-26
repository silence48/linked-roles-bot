import { Table } from '~/src/atoms/components/Table';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: Table,
  title: 'Data Show / Table',
  args: {
    headers: ['ID', 'Title']
  },
  argTypes: {
    headers: {
      type: {
        summary: 'array'
      }
    }
  },
  decorators: [withDesign]
};

const header = ['id', 'titles'];
const data = [
  [
    { value: '20042', type: 'simple' },
    { value: 'Once upon a time in the web.', type: 'simple' }
  ],
  [
    { value: '20042', type: 'simple' },
    { value: 'Once upon a time in the web.', type: 'simple' }
  ],
  [
    { value: '20042', type: 'simple' },
    { value: 'Once upon a time in the web.', type: 'simple' }
  ],
  [
    { value: '20042', type: 'simple' },
    { value: 'Once upon a time in the web.', type: 'simple' }
  ],
  [
    { value: '20042', type: 'simple' },
    { value: 'Once upon a time in the web.', type: 'simple' }
  ],[
    { value: { text: 'Text', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}, type: 'image' },
    { value: 'Once upon a time in the web.', type: 'simple' }
  ]
];

export const Default = (args: any) => (
  <Table {...args} header={header} data={data} />
);

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=971%3A68'
  }
};
