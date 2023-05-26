import { DateTime } from '~/src/atoms/components/DateTime';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';
import { FakeLink } from '~/src/atoms/helpers';

export default {
  component: DateTime,
  title: 'Components / DateTime',
  decorators: [withDesign]
};

export const Default = (args: any) => <DateTime {...args} component={FakeLink} to="/" />;

export const Medium = (args: any) => <DateTime {...args} variant="medium" component={FakeLink} to="/" />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/OG2qkuEFEhNmf2wTA0wAGq/Design-System?node-id=346%3A2961'
  }
};
