import React from 'react';
import { Button, Input } from '../../index';
import { useForm } from '../context';
import clsx from 'clsx'
import { type DynamicFormProps } from '../types';

type validationProps = null | { id: string, value: string, status: string, message: string } | boolean


export const StepperForm: React.FC<DynamicFormProps> = ({
  fields,
  debug = false,
  button,
}) => {
  const maxStep: number = fields.length - 1
  const [step, setStep] = React.useState(0)
  const { fieldsState, updateForm, formState } = useForm();
  const [validation, setValidation] = React.useState<validationProps>(null)
  const [allowance, setAllowance] = React.useState<boolean>(false)

  const nextStep = ({ key }: any) => {    
    if (step <= maxStep) {
      setStep(step + 1)
      setAllowance(false)
    }
  }

  // This effect checks for Input validations updates on every onChange
  React.useEffect(() => {
    if(fieldsState.length > 0 && step !== fieldsState.length) {
      (async () => {
        // Validating all fields in the current step
        const validationState = fieldsState[step].map(async (field: any, key: number) => {
          // If has no validation function return true
          if (field.validation?.fn === undefined) return true
          // If has no formState yet return false
          if (formState === null) return false
          // Get the value of the field from the formState
          const { value } = formState.find(({ id }: any) => id === field.id)
          console.log('value', value)
          // Run the validation function
          return await field.validation.fn(value)
        })
        // Wait for all validations to finish
        const result = await Promise.all(validationState)
        console.log('RESULT', result)
        // Allow to continue to next step if all validations are true
        setAllowance(result.every(e => e === true || e.valid === true))
      })();
    }
    // validate every time the formState changes
  }, [formState, allowance])


  const goBack = () => {    
    if (step >= 1) {
      setStep(step + -1)
      setAllowance(true)
    }
  }

  const barContainer = clsx(`grid gap-[4px] grid-cols-${maxStep + 2}`);

  return (
    <>
      {
        step === fieldsState.length ?
        <>
          <div className='text-subheading-bold text-neutral-800 mb-[20px]'>Review details</div>
          <div className="space-y-[8px]">
          {fieldsState.map(
            (
              fields: any,
              key: number
            ) => <div key={key}>
            {fields.map(({id, label}: any, key: number) => {
              // console.log('id', label)
              const { value } = formState.find(({id: formId}: any) => formId === id)
            return <div key={key}>
                <div className="text-neutral-800">{label}: {value}</div>
              </div>}
            )}
            </div>
          )}
          {formState.map(({ id, value}: any, key: any) => <input key={key} hidden={true} id={id} name={id} defaultValue={value}/> )}
          </div>
          <div className="pt-6 flex flex-col space-y-[20px]">
            <div className="flex flex-row justify-start space-x-[8px]">
              <Button
                text={button.text}
                type="submit"
                rounded="medium"
                variant={button.variant}
                customCss={button.customCss}
              />
              <Button onClick={() => goBack()} text="back" variant='basic' />
            </div>
            <div className="flex flex-col space-y-[8px]">
              <div>
                <span className="text-green-400 text-paragraph-medium-bold">{step}</span>
                <span className="text-green-200 text-paragraph-medium-medium pl-[2px]">/{maxStep + 1}</span>
              </div>
              <div className={barContainer}>
                <div className={`bg-green-400 rounded-[2px] h-[4px] col-span-${step + 1}`} />
              </div>
            </div>
          </div>
        </>
        :
        <div className="flex flex-col justify-between h-[420px]">
          
        {fieldsState.map(
          (
            fields: any,
            key: number
          ) => <>
            <div className={ step !== key ? 'hidden' : 'flex flex-col space-y-[12px]'}> 
                {fields.map((
                  {
                    type,
                    id,
                    label,
                    placeholder,
                    autoComplete,
                    required,
                    icon,
                    uploadFile,
                    options,
                    hidden = false,
                    afterChange,
                    validation,
                    maxLength,
                    variant,
                    populateOptions,
                    belongs_to,
                    disabled = false,
                    defaultValue,
                    title,
                    description,
                    multiple
                  }: any) => {
                  
                  return <>
                    { title && <div className="text-subheading-bold text-neutral-800">{title}</div> }
                    { description && <div className="text-paragraph-small-medium text-neutral-400">{description}</div> }
                    <Input
                      key={key}
                      type={type}
                      id={id}
                      disabled={disabled}
                      label={label}
                      options={options}
                      afterChange={type === 'select' || type === 'radiobox' ? afterChange : setValidation}
                      maxLength={maxLength}
                      variant={variant}
                      uploadFile={uploadFile}
                      icon={icon}
                      validation={validation}
                      belongs_to={belongs_to}
                      populateOptions={populateOptions}
                      hidden={step !== key ? true : hidden}
                      debug={debug}
                      defaultValue={!!defaultValue ? defaultValue : ''}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      required={required}
                      multiple={multiple}
                    />
                  </>
                })}
              </div>
            </>
          )}
        <div className="pt-6 flex flex-col space-y-[20px]">
          <div className="flex flex-row justify-start space-x-[8px]">
            <Button onClick={() => nextStep({ data: fields})} text="next" variant="primary" disabled={!Boolean(allowance)} />
            {step >= 1 && <Button onClick={() => goBack()} text="back" variant='basic' /> }
          </div>
          <div className="flex flex-col space-y-[8px]">
            <div>
              <span className="text-neutral-800 text-paragraph-medium-bold">{step + 1}</span>
              <span className="text-neutral-400 text-paragraph-medium-medium pl-[2px]">/{maxStep + 1}</span>
            </div>
          <div className={barContainer}>
            <div className={`bg-primary-400 rounded-[2px] h-[4px] col-span-${step + 1}`}></div>
            <div className={`bg-neutral-400 rounded-[2px] h-[4px] col-span-${maxStep - step + 1}`}></div>
          </div>
          </div>
        </div>
      </div>
      } 
    </>
  );
};
