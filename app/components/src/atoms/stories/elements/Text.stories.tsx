// import { Text } from '../../elements';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  title: 'Elements / Text',
  args: {
    theme: 'midnight'
  },
  decorators: [withDesign]
};

const textVariants = [
  'text-display-bold',
  'text-display-semi-bold',
  'text-display-extra-bold',
  'text-h1-normal-bold',
  'text-h1-normal-semi-bold',
  'text-h1-normal-extra-bold',
  'text-h1-small-bold',
  'text-h1-small-semi-bold',
  'text-h1-small-extra-bold',
  'text-h2-normal-bold',
  'text-h2-normal-semi-bold',
  'text-h2-normal-extra-bold',
  'text-h2-small-bold',
  'text-h2-small-semi-bold',
  'text-h2-small-extra-bold',
  'text-h3-normal-bold',
  'text-h3-normal-semi-bold',
  'text-h3-normal-extra-bold',
  'text-h3-small-bold',
  'text-h3-small-semi-bold',
  'text-h3-small-extra-bold',
  'text-h4-normal-bold',
  'text-h4-normal-semi-bold',
  'text-h4-normal-extra-bold',
  'text-h4-small-bold',
  'text-h4-small-semi-bold',
  'text-h4-small-extra-bold',
  'text-subheading-medium',
  'text-subheading-bold',
  'text-subheading-underlined',
  'text-subheading-light',
  'text-paragraph-large-medium',
  'text-paragraph-large-bold',
  'text-paragraph-large-underlined',
  'text-paragraph-large-light',
  'text-paragraph-medium-medium',
  'text-paragraph-medium-bold',
  'text-paragraph-medium-underlined',
  'text-paragraph-medium-light',
  'text-paragraph-small-medium',
  'text-paragraph-small-bold',
  'text-paragraph-small-underlined',
  'text-paragraph-small-light',
  'text-caption-medium',
  'text-caption-bold',
  'text-caption-underlined',
  'text-caption-light',
  'text-caption-bold-underlined',
  'text-footer-medium',
  'text-footer-bold',
  'text-footer-underlined',
  'text-footer-light',
  'text-footer-bold-underlined'
]


export const Text = (args: any) => {
  return <div className='text-neutral-800'>
    { textVariants.map((variant, index) => {
      return <div key={index} className={`${variant}`}>The quick brown fox jumps over the lazy dog.</div>
    })
    }
  </div>;
};

Text.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
