import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import { ConnectWallet } from '~/src/templates/ConnectWallet'
import '~/styles/index.css';

export default {
  component: ConnectWallet,
  title: 'New / ConnectWallet',
  argTypes: {},
  decorators: [withDesign]
};

export const Default = (args: any) => <ConnectWallet {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/'
  }
};
