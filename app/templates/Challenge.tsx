import React from 'react';

type ChallengeProps = {
  public_key: string;
};

export const Challenge: React.FC<ChallengeProps> = ({ public_key }) => {

  return (
    <>
      {public_key}
    </>
  );
};
