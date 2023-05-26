/* This example requires Tailwind CSS v2.0+ */
import React from 'react';

type StepProps = {
  component: React.ElementType;
  options: any;
};

type StepperProps = {
  type?: 'radio' | 'array';
  steps: StepProps[];
};

const Step: React.FC<StepProps> = ({ component: Component, options }) => {
  return <Component options={options}></Component>;
};

export const Stepper: React.FC<StepperProps> = ({ type = 'radio', steps }) => {
  const [current, setStep] = React.useState(0);

  return (
    <div>
      {/* {steps.indexOf(steps[current]) > 0 && (
        <button onClick={() => setStep(current - 1)}>Back</button>
      )} */}
      <Step
        component={steps[current].component}
        options={steps[current].options}
      />
      {steps.indexOf(steps[current]) >= 0 && (
        <button onClick={() => setStep(current + 1)}>Next</button>
      )}
    </div>
  );
};
