import * as React from 'react';
import { Form } from '~/src/atoms/components/Form';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

const loadPayload = () => console.log('Loading Payload');

const validateEmail: any = (mail: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) ? true : false
const validateText: any = (e: any) => {
  if(e.length > 3) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 800);
    });
  }
}

export default {
  component: Form,
  title: 'Data Handle / Form',
  args: {
    debug: true,
    fields: [
      { field: {
        type: 'text',
        id: 'id',
        label: 'ID',
        hidden: true,
      }},
      [
        {field: {
          type: 'text',
          id: 'name',
          label: 'Name',
          placeholder: 'Name',
          required: true,
        }},
        {field: {
          type: 'textarea',
          id: 'description',
          label: 'Description',
          placeholder: 'Description',
          required: true,
        }},
      ],
      { field: {
        type: 'time',
        id: 'duration',
        label: 'Duration',
        placeholder: 'Duration',
        required: true,
      }},
      { field: {
        type: 'number',
        id: 'price',
        label: 'Price',
        placeholder: 'Price',
        required: true,
      }},
      { field: {
        type: 'select',
        id: 'contracts_id',
        label: 'Smart Contracts',
        placeholder: 'Smart Contracts',
        required: true,
        defaultValue: '',
        options: [{name: 'XDR Direct Payment', value: '7e524b86-418a-4459-9fb7-ef85de7279b4'}]
      }},
      { field: {
        type: 'text',
        id: 'text',
        label: 'Text',
        icon: 'user',
        placeholder: 'write some words',
        validation: {
          fn: validateText
        }
      }},
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
      { field: {
        type: 'select',
        id: 'select',
        label: 'Select',
        placeholder: 'select',
        options: [
          { name: 'Option 1', value: 1 },
          { name: 'Option 2', value: 2 }
        ]
      }},
      {
        field: {
          type: 'datepicker',
          id: 'datepicker',
          icon: 'calendar',
          label: 'Date Picker',
      }},
      {
        field: {
          type: 'time',
          id: 'duration',
          label: 'Time Picker',
          // defaultValue: '2022-07-07',
          icon: 'user'
      }},
      { field: {
        type: 'radiobox',
        id: 'radio',
        label: 'Radio',
        placeholder: 'Radio',
        defaultValue: '2',
        options: [
          { name: 'Option 1', value: '1' },
          { name: 'Option 2', value: '2' }
        ]
      }},
      { field: {
        type: 'radiobox',
        id: 'radio2',
        label: 'Radio',
        placeholder: 'Radio',
        variant: 'full',
        defaultValue: '2',
        options: [
          { name: 'Option 1', value: '1', description: 'You are the only one able to access this project' },
          { name: 'Option 2', value: '2', description: 'You are the only one able to access this project' }
        ]
      }},
      { field: {
        type: 'radiobox',
        id: 'radio',
        label: 'Radio',
        placeholder: 'Radio',
        defaultValue: '2',
        variant: 'card',
        options: [
          { name: 'Option 1', value: '1' },
          { name: 'Option 2', value: '2' }
        ]
      }},
    ],
    button: {
      text: 'Submit',
      variant: 'primary'
    }
  },
  decorators: [withDesign]
};

export const Default = (args: any) => <Form {...args} />;

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
