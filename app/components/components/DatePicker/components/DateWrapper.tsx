import React from 'react';
import { useDayzed } from 'dayzed';
import { Calendar } from '.';

type DateWrapperProps = {
  selected: any;
  onDateSelected: any;
};
export const DateWrapper: React.FC<DateWrapperProps> = ({
  selected,
  onDateSelected
}: {
  selected: Date | Date[] | undefined;
  onDateSelected: any;
}) => {
  const dayzedData = useDayzed({ selected, onDateSelected });
  return <Calendar {...dayzedData} onDateSelected={onDateSelected} />;
};
