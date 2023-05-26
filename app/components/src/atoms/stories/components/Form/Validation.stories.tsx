import * as React from 'react';
import { Form } from '~/src/atoms/components/Form';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

const loadPayload = () => console.log('Loading Payload');

const validateText: any = (e: any) => {
  let valid = false;
  if (e === "1234") valid = true
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ valid, message: 'This field is required' })
    }, 800);
  });
  
}

const validateNumber: any = (e: any) => {
  let valid = false;
  if (e === "1") valid = true
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ valid, message: 'This field Number is required' })
    }, 800);
  });
  
}

const validateIsEmpty: any = (e: any) => {
  let valid = false;

  if (e.length > 0) valid = true


  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ valid, message: 'This field is required' })
    }, 800);
  }); 
}

export default {
  component: Form,
  title: 'Data Handle / Form',
  argTypes: {
    type: {
      options: ['stepper', 'fetcher', 'remix', 'dynamic', 'default'],
      control: { type: 'radio' },
    },
  },
  args: {
    type: 'stepper',
    debug: true,
    button: {
      text: 'Submit',
      variant: 'primary'
    }
  },
  decorators: [withDesign]
};


const fields = [
  [{ field: {
    type: 'text',
    id: 'name',
    label: 'Text',
    icon: 'user',
    placeholder: 'write some at least 3 words',
    maxLength: 10,
    validation: {
      fn: validateText
    }
  }},
  {field: {
    type: 'select',
    id: 'select',
    label: 'Select',
    placeholder: 'select',
    options: [
      { name: 'Option 1', value: 1 },
      { name: 'Option 2', value: 2 }
    ]
  }},
  ],
  { field: {
    type: 'text',
    id: 'first_data',
    label: 'First data',
    icon: 'user',
    placeholder: 'write some at least 3 words',
    validation: {
      fn: validateText
    }
  }},
  { field: {
    type: 'number',
    id: 'quantity',
    label: 'Quantity',
    placeholder: '0',
    
  }},
  [
    { field: {
    type: 'time',
    id: 'duration',
    label: 'Duration',
    placeholder: 'Duration',
    validation: {
      fn: validateIsEmpty
    }
  }},
  { field: {
    type: 'number',
    id: 'price',
    label: 'Price',
    placeholder: '$ 00.00',
    validation: {
      fn: validateNumber
    }
  }},
  { field: {
    type: 'select',
    id: 'contracts_id',
    label: 'Smart Contracts',
    placeholder: 'Smart Contracts',
    options: [
      {name: '122', value: '122-418a-4459-9fb7-ef85de7279b4'},
      {name: '124', value: '124-418a-4459-9fb7-ef85de7279b4'},
    ]
  }},
],
//   [{ field: {
//     type: 'text',
//     id: 'name',
//     label: 'Text',
//     icon: 'user',
//     placeholder: 'write some at least 3 words',
//     validation: {
//       fn: validateText
//     }
//   }},
//   { field: {
//     type: 'text',
//     id: 'user',
//     label: 'Text',
//     icon: 'user',
//     placeholder: 'write some at least 3 words',
//   }}],
//   [{ field: {
//     type: 'text',
//     id: 'description',
//     label: 'Text',
//     icon: 'user',
//     placeholder: 'write some at least 3 words',
//     validation: {
//       fn: validateText
//     }
//   }},
//   ],
]
export const Validation = (args: any) => <Form {...args} fields={fields} id="1974" />;

// Validation.parameters = {
//   design: {
//     type: 'figma',
//     url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
//   }
// };
