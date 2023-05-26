import React from 'react';
import { Button } from '~/src/atoms/components/Button';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';
import { FakeLink} from '~/src/atoms/helpers/'
export default {
  component: Button,
  title: 'Components / Button',
  args: {
    variant: 'primary',
    text: 'Button',
    size: 'medium',
    icon: 'user',
    loading: false
  },
  argTypes: {
    variant: {
      type: {
        summary: 'string'
      },
      options: ['primary', 'secondary', 'alert', 'warning', 'positive', 'icon'],
      control: {
        type: 'radio'
      }
    },
    size: {
      type: {
        summary: 'string'
      },
      options: ['small', 'medium', 'large'],
      control: {
        type: 'radio'
      }
    },
    text: {
      type: {
        summary: 'string'
      }
    },
  },
  decorators: [withDesign]
};

export const Default = (args: any) => (
    <Button {...args} />
);

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/94RZpTzUGCb20phpH5PFaC/Untitled?node-id=137%3A24870'
  }
};

const buttonCollection = [
  { variant: 'primary', size: 'tiny' },
  { variant: 'primary', size: 'small' },
  { variant: 'primary', size: 'medium' },
  { variant: 'primary', size: 'large' },
  { variant: 'primary', size: 'xlarge' },
  { variant: 'secondary', size: 'tiny' },
  { variant: 'secondary', size: 'small' },
  { variant: 'secondary', size: 'medium' },
  { variant: 'secondary', size: 'large' },
  { variant: 'secondary', size: 'xlarge' },
  { variant: 'warning', size: 'tiny' },
  { variant: 'warning', size: 'small' },
  { variant: 'warning', size: 'medium' },
  { variant: 'warning', size: 'large' },
  { variant: 'warning', size: 'xlarge' },
  { variant: 'positive', size: 'tiny' },
  { variant: 'positive', size: 'small' },
  { variant: 'positive', size: 'medium' },
  { variant: 'positive', size: 'large' },
  { variant: 'positive', size: 'xlarge' },
  { variant: 'basic', size: 'tiny' },
  { variant: 'basic', size: 'small' },
  { variant: 'basic', size: 'medium' },
  { variant: 'basic', size: 'large' },
  { variant: 'basic', size: 'xlarge' },
  { variant: 'outline', size: 'tiny' },
  { variant: 'outline', size: 'small' },
  { variant: 'outline', size: 'medium' },
  { variant: 'outline', size: 'large' },
  { variant: 'outline', size: 'xlarge' },
  { variant: 'dropdown', size: 'tiny' },
  { variant: 'dropdown', size: 'small' },
  { variant: 'dropdown', size: 'medium' },
  { variant: 'dropdown', size: 'large' },
  { variant: 'dropdown', size: 'xlarge' },
];

const iconCollection = [
  { variant: 'primary', size: 'tiny', icon: 'user' },
  { variant: 'primary', size: 'small', icon: 'user' },
  { variant: 'primary', size: 'medium', icon: 'user' },
  { variant: 'primary', size: 'large', icon: 'user' },
  { variant: 'primary', size: 'xlarge', icon: 'user' },
  { variant: 'secondary', size: 'tiny', icon: 'user' },
  { variant: 'secondary', size: 'small', icon: 'user' },
  { variant: 'secondary', size: 'medium', icon: 'user' },
  { variant: 'secondary', size: 'large', icon: 'user' },
  { variant: 'secondary', size: 'xlarge', icon: 'user' },
  { variant: 'warning', size: 'tiny', icon: 'user' },
  { variant: 'warning', size: 'small', icon: 'user' },
  { variant: 'warning', size: 'medium', icon: 'user' },
  { variant: 'warning', size: 'large', icon: 'user' },
  { variant: 'warning', size: 'xlarge', icon: 'user' },
  { variant: 'positive', size: 'tiny', icon: 'user' },
  { variant: 'positive', size: 'small', icon: 'user' },
  { variant: 'positive', size: 'medium', icon: 'user' },
  { variant: 'positive', size: 'large', icon: 'user' },
  { variant: 'positive', size: 'xlarge', icon: 'user' },
  { variant: 'basic', size: 'tiny', icon: 'user' },
  { variant: 'basic', size: 'small', icon: 'user' },
  { variant: 'basic', size: 'medium', icon: 'user' },
  { variant: 'basic', size: 'large', icon: 'user' },
  { variant: 'basic', size: 'xlarge', icon: 'user' },
  { variant: 'outline', size: 'tiny', icon: 'user' },
  { variant: 'outline', size: 'small', icon: 'user' },
  { variant: 'outline', size: 'medium', icon: 'user' },
  { variant: 'outline', size: 'large', icon: 'user' },
  { variant: 'outline', size: 'xlarge', icon: 'user' },
  { variant: 'dropdown', size: 'tiny', icon: 'user' },
  { variant: 'dropdown', size: 'small', icon: 'user' },
  { variant: 'dropdown', size: 'medium', icon: 'user' },
  { variant: 'dropdown', size: 'large', icon: 'user' },
  { variant: 'dropdown', size: 'xlarge', icon: 'user' },
];

const iconButtonCollection = [
  { variant: 'primary', size: 'tiny', icon: 'user' },
  { variant: 'primary', size: 'small', icon: 'user' },
  { variant: 'primary', size: 'medium', icon: 'user' },
  { variant: 'primary', size: 'large', icon: 'user' },
  { variant: 'primary', size: 'xlarge', icon: 'user' },
  { variant: 'secondary', size: 'tiny', icon: 'user' },
  { variant: 'secondary', size: 'small', icon: 'user' },
  { variant: 'secondary', size: 'medium', icon: 'user' },
  { variant: 'secondary', size: 'large', icon: 'user' },
  { variant: 'secondary', size: 'xlarge', icon: 'user' },
  { variant: 'warning', size: 'tiny', icon: 'user' },
  { variant: 'warning', size: 'small', icon: 'user' },
  { variant: 'warning', size: 'medium', icon: 'user' },
  { variant: 'warning', size: 'large', icon: 'user' },
  { variant: 'warning', size: 'xlarge', icon: 'user' },
  { variant: 'positive', size: 'tiny', icon: 'user' },
  { variant: 'positive', size: 'small', icon: 'user' },
  { variant: 'positive', size: 'medium', icon: 'user' },
  { variant: 'positive', size: 'large', icon: 'user' },
  { variant: 'positive', size: 'xlarge', icon: 'user' },
  { variant: 'basic', size: 'tiny', icon: 'user' },
  { variant: 'basic', size: 'small', icon: 'user' },
  { variant: 'basic', size: 'medium', icon: 'user' },
  { variant: 'basic', size: 'large', icon: 'user' },
  { variant: 'basic', size: 'xlarge', icon: 'user' },
  { variant: 'outline', size: 'tiny', icon: 'user' },
  { variant: 'outline', size: 'small', icon: 'user' },
  { variant: 'outline', size: 'medium', icon: 'user' },
  { variant: 'outline', size: 'large', icon: 'user' },
  { variant: 'outline', size: 'xlarge', icon: 'user' },
  { variant: 'dropdown', size: 'tiny', icon: 'user' },
  { variant: 'dropdown', size: 'small', icon: 'user' },
  { variant: 'dropdown', size: 'medium', icon: 'user' },
  { variant: 'dropdown', size: 'large', icon: 'user' },
  { variant: 'dropdown', size: 'xlarge', icon: 'user' },
];

export const Collection = (args: any) => (
  <>
      <div className="text-neutral-800 text-h2-normal-bold">Buttons</div>
      <div className="flex flex-col space-y-[20px]">
      <div className="text-neutral-800 text-h3-normal-bold">Action</div>
      <div className='grid grid-cols-5 grid-flow-row gap-[20px]'>
        {buttonCollection.map(({ variant, size }: any) => {
          const type = 'button';
          return (
            <div>
              <Button
                variant={variant}
                size={size}
                type={type}
                text={variant !== 'icon' && variant}
              />
            </div>
          );
        })}
      </div>
      <div className='grid grid-cols-5 grid-flow-row gap-[20px]'>
        {buttonCollection.map(({ variant, size }: any) => {
          const type = 'button';
          return (
            <div>
              <Button
                variant={variant}
                size={size}
                type={type}
                loading={true}
                text={variant !== 'icon' && variant}
              />
            </div>
          );
        })}
      </div>
      <div className='grid grid-cols-5 grid-flow-row gap-[20px]'>
        {iconCollection.map(({ variant, size, icon }: any) => {
          const type = 'button';
          return <div><Button variant={variant} size={size} type={type} icon={icon} /></div>;
        })}
      </div>
      <div className='grid grid-cols-5 grid-flow-row gap-[20px]'>
        {iconButtonCollection.map(({ variant, size, icon }: any) => {
          const type = 'button';
          return (
            <div><Button variant={variant} size={size} type={type} icon={icon} text={variant} /></div>
          );
        })}
      </div>
      <div className="text-neutral-800 text-h3-normal-bold">Links</div>
      <div className='grid grid-cols-5 grid-flow-row gap-[20px]'>
        {buttonCollection.map(({ variant, size }: any) => {
          const type = 'link';
          return (
            <div>
            <Button
              variant={variant}
              size={size}
              type={type}
              text={variant !== 'icon' && variant}
              component={FakeLink}
            />
            </div>
          );
        })}
      </div>
      <div className='grid grid-cols-5 grid-flow-row gap-[20px]'>
        {iconCollection.map(({ variant, size, icon }: any) => {
          const type = 'link';
          return <div><Button variant={variant} size={size} type={type} icon={icon} component={FakeLink}/></div>;
        })}
      </div>
      <div className='grid grid-cols-5 grid-flow-row gap-[20px]'>
        {iconButtonCollection.map(({ variant, size, icon }: any) => {
          const type = 'link';
          return (
            <div><Button variant={variant} size={size} type={type} icon={icon} text={variant} component={FakeLink}/></div>
          );
        })}
      </div>
      </div>
  </>
);

Collection.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/OG2qkuEFEhNmf2wTA0wAGq/Design-System?node-id=462%3A3547'
  }
};
