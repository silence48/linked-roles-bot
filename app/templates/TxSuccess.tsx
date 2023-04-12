import React from 'react';

type TxSuccessProps = {
  content: any
};

export const TxSuccess: React.FC<TxSuccessProps> = ({ content }) => {
  console.log('content', content)
  return (
    <>
      <div className="text-h3-normal-semi-bold text-green">Success!</div>
      <div className="text-paragraph-medium-medium">
        <span>You have successfully claimed the Key to access </span>
        <span className="font-bold">Member role</span>.
      </div>
      <div>Please go back to discord to complete the process.</div>
    </>
  );
};
