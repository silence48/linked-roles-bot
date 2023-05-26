import React from 'react';

type BreadcrumbProps = {
  items?: [];
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items
}) => {

  return <div className="grid grid-cols-3 gap-4 content-start">{items?.map((item: any) => {
    return <div><div className="text-[14px] text-neutral-800 font-bold">{item[0]}</div><div className="text-[16.2px] text-neutral-900">{item[1]}</div></div>
  })}</div>;
};
