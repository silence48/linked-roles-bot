import React from 'react';

type TextProps = {
  content?: string;
  fontSize?: string;
};

export const Text: React.FC<TextProps> = ({
  content,
  fontSize,
}) => {

  return <div className="text-paragraph-small-medium text-neutral-800 p-[8px]" style={{ fontSize: `${fontSize}px`}}>{content}</div>;
};
