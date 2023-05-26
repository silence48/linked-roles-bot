import { ColorPallet } from '../../elements';
import { withDesign } from 'storybook-addon-designs';
import { colors_list } from '../../helpers/constants';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: ColorPallet,
  title: 'Elements / Color',
  args: {
    theme: 'light'
  },
  decorators: [withDesign]
};
// colors_list.map((color: string) => {
//   return { name: '', style: `bg-${color}`}
// })

const colors = [
  { name: '100', style: 'bg-primary-100' },
  { name: '200', style: 'bg-primary-200' },
  { name: '300', style: 'bg-primary-300' },
  { name: '400', style: 'bg-primary-400' },
  { name: '500', style: 'bg-primary-500' },
  { name: '600', style: 'bg-primary-600' },
  { name: '700', style: 'bg-primary-700' },
  { name: '800', style: 'bg-primary-800' },
  { name: '900', style: 'bg-primary-900' },
  { name: '1000', style: 'bg-primary-1000' },
  { name: '1100', style: 'bg-primary-1100' },
  { name: '1200', style: 'bg-primary-1200' },
  { name: '1300', style: 'bg-primary-1300' },
  { name: '100', style: 'bg-secondary-100' },
  { name: '200', style: 'bg-secondary-200' },
  { name: '300', style: 'bg-secondary-300' },
  { name: '400', style: 'bg-secondary-400' },
  { name: '500', style: 'bg-secondary-500' },
  { name: '600', style: 'bg-secondary-600' },
  { name: '700', style: 'bg-secondary-700' },
  { name: '800', style: 'bg-secondary-800' },
  { name: '900', style: 'bg-secondary-900' },
  { name: '1000', style: 'bg-secondary-1000' },
  { name: '1100', style: 'bg-secondary-1100' },
  { name: '1200', style: 'bg-secondary-1200' },
  { name: '1300', style: 'bg-secondary-1300' },
  { name: '100', style: 'bg-neutral-100' },
  { name: '200', style: 'bg-neutral-200' },
  { name: '300', style: 'bg-neutral-300' },
  { name: '400', style: 'bg-neutral-400' },
  { name: '500', style: 'bg-neutral-500' },
  { name: '600', style: 'bg-neutral-600' },
  { name: '700', style: 'bg-neutral-700' },
  { name: '800', style: 'bg-neutral-800' },
  { name: '900', style: 'bg-neutral-900' },
  { name: '1000', style: 'bg-neutral-1000' },
  { name: '1100', style: 'bg-neutral-1100' },
  { name: '1200', style: 'bg-neutral-1200' },
  { name: '1300', style: 'bg-neutral-1300' },
];

export const Pallet = (args: any) => {
  return <ColorPallet {...args} colors={colors} />;
};

Pallet.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
