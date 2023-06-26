import * as React from 'react';
import { Icon } from '~/components/Icon';

export const IconHeading = ({ text, icon }: any) => {
    return (
      <div className="flex flex-row">
        <Icon name={icon} size="large" />
        <div className="text-h4-bold">{text}</div>
      </div>
    );
  };