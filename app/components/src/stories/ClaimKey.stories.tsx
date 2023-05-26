import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import { ClaimKey } from '~/src/templates/ClaimKey'
import '~/styles/index.css';

export default {
  component: ClaimKey,
  title: 'New / ClaimKey',
  argTypes: {},
  decorators: [withDesign]
};

export const Default = (args: any) => <ClaimKey {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/'
  }
};
