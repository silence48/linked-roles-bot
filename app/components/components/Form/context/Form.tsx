import React from 'react';
import { Button } from '../..';
import { getFields } from '../utils'

type FormContextType = {
  fieldsState: any;
  updateForm: () => void;
  formState: any[];
};

type FormProviderProps = {
  children: React.ReactNode
  fields: any
  action?: string | undefined;
  component?: React.ElementType;
};

export const FormContext = React.createContext<FormContextType>(
  {} as FormContextType
);

export const FormProvider: React.FC<FormProviderProps> = ({ children, fields, action, component: Form }) => {
  const formRef = React.createRef<HTMLFormElement>();
  const [ formState, updateFormState ] = React.useState< null | any >(null)
  const fieldsState = getFields(fields)
  console.log('fieldsState', fieldsState)
  const updateForm = () => {
    updateFormState(getFormData())
  };

  const getFormData = () => ['input', 'textarea'].map((tagName) => {
    const htmlCollection = formRef?.current?.getElementsByTagName(tagName), formFields = Array.from(htmlCollection || [])
    if (formFields.length === 0) return
    return formFields.map((field: any) => {
      return { id: field.id, value: field.value }
    })
  }).flat(1)
  

  React.useEffect(() => {
    updateFormState(getFormData())
  }, [])

  React.useEffect(() => {
    const newState = getFormData();
    if (JSON.stringify(newState) !== JSON.stringify(formState)) {
      updateFormState(newState)
    }
  }, [formState])

  return (
    <FormContext.Provider value={{ fieldsState, updateForm, formState }}>
      {
        Form
        ? 
        <Form method="post" action={action || ''} ref={formRef}>
          {children}
        </Form>
        : 
        <form method="post" action={action || ''} ref={formRef}>
          {children}
        </form>
      }
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  return React.useContext(FormContext);
};
