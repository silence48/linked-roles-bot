import React from 'react';

type TxSuccessProps = {
  content: any
};

export const TxSuccess: React.FC<TxSuccessProps> = ({ content }) => {
  console.log('content', content)
  return (
    <>
      <div className="text-h3-normal-semi-bold text-green">Success!</div>
      <div className="text-paragraph-medium-medium">You have successfully claimed the Key to access Member role.</div>
    </>
  );
};
