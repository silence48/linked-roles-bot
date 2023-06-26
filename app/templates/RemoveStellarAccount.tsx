import React from 'react';
import { useState } from 'react';
import { Button } from '~/components/Button';
import { FiTrash2 } from "react-icons/fi";

export const RemoveStellarAccount = ({ public_key }: any) => {
  const [hover, setHover] = useState(false);
  return (
    <div>
      <div>Are you sure you want to remove the following account? {public_key}</div>
      <form method="post" action="/delink">
          <input
            type="hidden"
            name="publicKey"
            value={public_key}
          />
          <button className="btn btn-square btn-outline btn-error" type="submit"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          >
            <FiTrash2  style={{ color: hover ? 'red' : 'initial' }} /> 
          </button>
        </form>
      
    </div>
  );
};
