import * as React from 'react';
import { Button } from '~/components/Button';

export const RemoveStellarAccount = ({ public_key }: any) => {
  const handleRemove = () => {};
  return (
    <div>
      <div>Are you sure you want to remove the following account? {public_key}</div>
      <Button onClick={() => handleRemove()} text="Confirm" size="medium" variant="warning" />
    </div>
  );
};
