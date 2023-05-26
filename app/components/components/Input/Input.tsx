import React from 'react';
import { useForm } from '../Form/context';

import {
  UploadFileInput,
  TextInput,
  TextAreaInput,
  SelectInput,
  DefaultInput,
  CheckBoxInput,
  RadioboxInput,
  NumberInput,
  PickerInput,
  RCInput
} from './components';
import { DatePicker, TimePicker } from '..';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  id = 'text',
  variant,
  autoComplete = 'off',
  label,
  placeholder,
  disabled,
  populateOptions,
  maxLength,
  uploadFile,
  defaultValue,
  belongs_to,
  validation,
  icon,
  afterChange,
  options,
  hidden,
  debug = false,
  required,
  multiple
}) => {
  const { fieldsState, formState } = useForm();
  const [ value, setValue ] = React.useState(defaultValue)
  const [ dependencies, setDependencies ] = React.useState([])

  React.useEffect(() => {
    const field = fieldsState.map((fields: any) => fields.find((e: any) => e.id === id)).filter((e: any) => !!e)[0]
    field.value && setValue(field.value)
  }, [])

  React.useEffect(() => {
    if (belongs_to && populateOptions && formState) {
      (async () => {
        const parentValue = formState.map((field: any) => {
          return field.id === belongs_to ? field.value : undefined
        }).filter((item: any) => typeof item ==='string')[0]
        const options = await populateOptions({value: parentValue, name: ''})
        setDependencies(options)
      })();
    }
  }, [formState])

  if (!options && !dependencies && type === 'select') return <>You are missing the options for Select</>
  if (!options && !dependencies && type === 'radiobox') return <>You are missing the options for Radiobox</>


  const config = {
    id,
    debug,
    autoComplete,
    variant,
    validation,
    afterChange,
    defaultValue: value,
    maxLength,
    populateOptions,
    label,
    disabled,
    icon,
    placeholder,
    hidden,
    uploadFile,
    options: options ? options : dependencies,
    required,
    belongs_to,
    multiple
   };
  switch (type) {
    case 'text':
      return <TextInput config={{ ...config, type }} />;
    case 'textarea':
      return <TextAreaInput config={{ ...config, type }} />;
    case 'select':
      return <SelectInput config={{ ...config, type }} />;
    case 'time':
      return <PickerInput config={{ ...config, type }} component={TimePicker} />;
    case 'number':
      return <NumberInput config={{ ...config, type }} />;
    case 'upload':
      return <UploadFileInput uploadFile={uploadFile} config={{ ...config, type }} />;
    case 'datepicker':
      return <PickerInput config={{ ...config, type }} component={DatePicker} />;
    case 'checkbox':
      return <CheckBoxInput config={{ ...config, type }} />;
    case 'radiobox':
      return <RadioboxInput config={{ ...config, type }} />;
    case 'rci':
      return <RCInput config={{ ...config, type }} />;
    default:
      return <DefaultInput config={{ ...config, type }} />;
  }
};
