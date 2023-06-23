import * as React from "react";
import { Link } from '@remix-run/react';

export const DiscordLogin: React.FC = ({}) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <Link className="btn btn-primary normal-case text-xl" to="/verify">
          Connect Your Discord
        </Link>
      </div>
    </>
  );
};
