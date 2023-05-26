import * as React from 'react';
import { DynamicForm, StepperForm } from './components';
import { FormProvider } from './context';
import { Button } from '..';
import { type FormProps } from './types';

export const Form: React.FC<FormProps> = ({
  type = 'default',
  id,
  fields,
  action,
  debug = false,
  button,
  component: Component,
}) => {

  const formAssert = (type: string, configuration: any) => {
    const { fields, button, action } = configuration;
    switch (type) {
      case 'stepper':
        return <StepperForm fields={fields} button={button} action={action} debug={debug} />;
      case 'dynamic':
        return <DynamicForm fields={fields} button={button} action={action} debug={debug} />;
      default:
        return <DynamicForm fields={fields} button={button} action={action} debug={debug} />;
    }
  };
  return (
    <>
      <FormProvider fields={fields} action={!!action ? action : ''} component={Component}>
        <input
          type='text'
          hidden={true}
          name="id"
          id="id"
          readOnly={true}
          defaultValue={id}
        />
        {formAssert(type, {
          fields,
          action,
          button
        })}
      </FormProvider>
    </>
  );
};
