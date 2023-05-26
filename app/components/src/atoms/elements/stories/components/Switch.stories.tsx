import { Switch } from '~/src/atoms/components/Switch';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: Switch,
  title: 'Components / Switch',
  decorators: [withDesign]
};

// export const Default = () => <Switch></Switch>;

// Default.parameters = {
//   design: {
//     type: 'figma',
//     url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
//   }
// };
