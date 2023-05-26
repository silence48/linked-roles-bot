import React from 'react';
import { Button } from '../Button';

type HeadingCardProps = {
  type: 'SECTION' | 'PAGE';
  section?: {
    title?: string;
    navOptions?: {
      title: string;
      type: 'button' | 'link';
      action?: () => void;
      to?: string;
      icon?: any;
    }[];
  };
  page?: {
    title?: string;
  };
};

export const Heading: React.FC<HeadingCardProps> = ({
  type = 'SECTION',
  section,
  page
}) => {
  return (
    <div className="sm:flex sm:items-center sm:justify-between h-v8 text-neutral-800">
      <div className="text-4xl font-bold leading-6 text-primary">
        {section?.title}
      </div>
      <div className="mt-3 flex sm:mt-0 sm:ml-4">
        {section?.navOptions &&
          section.navOptions.map(({ title, action, icon }, key) => {
            return (
              <Button
                key={key}
                text={title}
                icon={icon}
                size="small"
                onClick={action}
              />
            );
          })}
      </div>
    </div>
  );
};
