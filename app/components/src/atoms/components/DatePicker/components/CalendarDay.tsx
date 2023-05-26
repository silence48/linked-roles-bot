import React from 'react';

type CalendarDayProps = {
  selectable: any;
  date: any;
  dateObj: any;
  onDateSelected: any;
  color: string;
  background: string;
  getDateProps: any;
};

export const CalendarDay: React.FC<CalendarDayProps> = ({
  selectable,
  date,
  dateObj,
  onDateSelected,
  color,
  background,
  getDateProps
}) => {
  return (
    <div className="cursor-pointer flex w-full justify-center">
      <div>
        <button
          type="button"
          className={`w-10 h-10 flex items-center justify-center font-medium text-${color} ${background} rounded-full`}
          {...getDateProps({ dateObj })}
          onClick={() => onDateSelected(dateObj)}
        >
          {selectable ? date.getDate() : 'X'}
        </button>
      </div>
    </div>
  );
};
