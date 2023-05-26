import * as React from 'react';
import { Form } from '~/src/atoms/components/Form';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

export default {
  component: Form,
  title: 'Data Handle / Form',
  args: {
    button: {
      text: 'Create',
      variant: 'primary',
    },
  },
  decorators: [withDesign]
};

const validateText: any = (e: any) => {
  if(e?.length > 3) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 800);
    });
  }
}

export const StepperForm = (args: any) => {

  const getChild: any = async (e: any) => {
    // console.log('Get Child', e)
    if (e.value === "1") {
      return [{ name: 'Option A', value: '1' },{ name: 'Option B', value: '2' }]
    } else if (e.value === "2") {
      return [{ name: 'Option C', value: '3' },{ name: 'Option D', value: '4' }]
    }
  }

  const fields = [
    {
      field: {type: 'id',
      id: 'id',
      hidden: true}
    },
    [
      { field: {
        type: 'text',
        id: 'id-1',
        label: 'ID 1',
        validation: {
          fn: validateText
        },
        placeholder: 'example@email.com'
      }},
      { field: {
        type: 'text', 
        id: 'id-2',
        label: 'ID 2',
        validation: {
          fn: validateText
        },
        placeholder: 'example@email.com'
      }},
    ],
    {
      field: {
        type: 'select',
        id: 'category',
        label: 'Category',
        options: [
          { name: 'Option 1', value: '1' },
          { name: 'Option 2', value: '2' }
        ],
      }
    },
    {
      field: {
        type: 'select',
        id: 'subcategory',
        label: 'Sub Category',
        belongs_to: 'category',
        populateOptions: getChild
      }
    },
    {
      field: {type: 'textarea',
      id: 'textarea',
      label: 'Text Area',
      placeholder: 'Set a description'}
    },
    // {
    //   field: {type: 'datepicker',
    //   id: 'datepicker',
    //   label: 'Date Picker'}
    // }
  ]  
  return <Form {...args} type='stepper' fields={fields} />
};

StepperForm.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
