import React from 'react';
import { Button, Input } from '../../index';
import { useForm } from '../context';
import { type DynamicFormProps } from '../types';

export const DynamicForm: React.FC<DynamicFormProps> = ({
  debug = false,
  button,
}) => {

  const { fieldsState } = useForm();

  
  return (
    <>
      <div className="space-y-4">
        {fieldsState.map(
            (
              fields: any,
              key: number
            ) => <div key={key}>
          {fields.map(({
              type,
              id,
              label,
              placeholder,
              autoComplete,
              required,
              uploadFile,
              icon,
              options,
              hidden = false,
              afterChange,
              populateOptions,
              belongs_to,
              disabled = false,
              defaultValue
            }: any, key: any ) => 
              <Input
                key={key}
                type={type}
                id={id}
                disabled={disabled}
                options={options}
                label={label}
                uploadFile={uploadFile}
                hidden={hidden}
                icon={icon}
                belongs_to={belongs_to}
                populateOptions={populateOptions}
                debug={debug}
                defaultValue={!!defaultValue ? defaultValue : ''}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required={required}
              />
            )}
          </div>
          )}
        </div>
        <div className="pt-6">
          <Button
            text={button.text}
            type="submit"
            rounded="medium"
            size={button.size}
            icon={button.icon}
            loading={button.loading}
            variant={button.variant}
            customCss={button.customCss}
          />
        </div>
    </>
  );
};
