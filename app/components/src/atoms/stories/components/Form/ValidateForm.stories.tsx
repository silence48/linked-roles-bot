import * as React from 'react';
import { Form } from '~/src/atoms/components/Form';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

const loadPayload = () => console.log('Loading Payload');

const validateEmail: any = (mail: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) ? true : false

export default {
  component: Form,
  title: 'Data Handle / Form',
  args: {
    fields: [
      { field: {
        type: 'email',
        id: 'email',
        label: 'Email',
        placeholder: 'example@email.com'
      }},
      { field: {
        type: 'password',
        id: 'password',
        label: 'Password',
        placeholder: 'Set you password'
      }},
      { field: {
        type: 'textarea',
        id: 'textarea',
        label: 'Text Area',
        placeholder: 'Set a description'
      }},
      {field: {
        type: 'select',
        id: 'select',
        label: 'Select',
        placeholder: 'select',
        options: [
          { name: 'Option 1', id: 1 },
          { name: 'Option 2', id: 2 }
        ]
      }},
      { field: {
        type: 'datepicker',
        id: 'datepicker',
        label: 'Date Picker'
      }}
    ],
    button: {
      text: 'Submit',
      variant: 'primary'
    }
  },
  decorators: [withDesign]
};

export const ValidateForm = (args: any) => <Form {...args} />;

ValidateForm.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
