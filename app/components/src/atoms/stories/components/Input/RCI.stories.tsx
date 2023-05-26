import * as React from 'react';
import { Input } from '~/src/atoms/components/Input';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

function mockFunction(value: any): any {
  // console.log(value);
}

const checkCodeApiMock = (code: string): Promise<boolean> => {
  return new Promise<boolean>((r) => setTimeout(r, 350, code === '123456'))
}

export default {
  component: Input,
  title: 'Data Handle / Input',
  args: {
    type: 'rci',
    id: 'code',
    maxLength: 6,
  },
  decorators: [withDesign]
};

export const RCI = (args: any) => {
  const [ state, setState ] = React.useState('input');

  const checkCodeApiMock = (code: string) => {
    if (code === '123456') {
      setState('success')
    } else {
      setState('error')
    }
  }

  return <Input {...args} validation={{ state: state, fn: checkCodeApiMock }}/>
}

RCI.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
