import { DatePicker } from '~/src/atoms/components/DatePicker';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: DatePicker,
  title: 'Data Handle / Picker',
  decorators: [withDesign]
};

export const Default = (args: any) => <DatePicker {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=971%3A68'
  }
};
