import { ColorChecker } from '~/src/atoms/components/ColorChecker';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: ColorChecker,
  title: 'Lab / ColorChecker',
  args: {},
  decorators: [withDesign]
};

export const Default = (args: any) => <ColorChecker {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=971%3A68'
  }
};
