import { Sidebar, Button } from '~/src/atoms/components';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';
import * as React from 'react';

export default {
  component: Sidebar,
  title: 'Components / Sidebar',
  decorators: [withDesign]
};

export const Default = () => {
  const [ open, setOpen ] = React.useState(true);
  return <div>
    <div className="text-neutral-800">{open ? 'OPEN' : 'CLOSED'}</div>
    <Button text="toggle" onClick={() => setOpen(!open)}/>
    <Sidebar initialState={open}>
      <li>Home Page</li>
      <li>Example 1</li>
      <li>Example 2</li>
      <li>Example 3</li>
    </Sidebar>
  </div>
};

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
