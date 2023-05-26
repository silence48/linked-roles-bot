import { Icon } from '~/src/atoms/components/Icon/';
import { icons } from '../../../assets/icons';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: Icon,
  title: 'Elements / Icon',
  args: {
    name: 'user',
    color: 'white'
  },
  decorators: [withDesign]
};

export const Default = () => {
  return (
    <>
      {Object.keys(icons).map((key: any) => {
        return <Icon name={key} color="secondary" />;
      })}
    </>
  );
};

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=1031%3A75'
  }
};
