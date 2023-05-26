import React from 'react';
import { DateWrapper } from './components';
// import { Moon } from "lunarphase-js";
import { DateTime } from 'luxon';
import { formatISO, startOfDay } from 'date-fns';

type DatePickerProps = {
  value?: string;
  defaultValue?: any;
  handleChange: any;
  close: () => void;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  defaultValue,
  handleChange,
  close,
}: any) => {
  const [selected, setSelected] = React.useState({
    selectedDate: !!value ? (typeof value === 'string' ? new Date(value) : value) : new Date(),
    date: value,
    firstDayOfWeek: 0,
    showOutsideDays: false
  });

  const handleOnDateSelected = (dateObj: { date: Date, selectable: boolean}) => {
    const { date, selectable } = dateObj;
    if (!selectable) {
      return;
    } else {
      setSelected({
        ...selected,
        selectedDate: date,
        date: date
      });
      const dt = DateTime.fromJSDate(date).startOf('day')
      handleChange({name: `${dt.weekdayShort} ${dt.day} ${dt.monthLong}`, value: +new Date(date) / 1000})
    }
  };

  return (
    <>
    <DateWrapper
      selected={selected.selectedDate}
      onDateSelected={handleOnDateSelected}
    />
    {/* <div className="p-[8px] text-neutral-800">
      <div className="text-paragraph-small-medium">Lunar Data</div>
      <div className="flex space-x-[8px] text-caption-bold">
        <div>{Moon.lunarPhaseEmoji(selected?.selectedDate)}</div>
        <div>{Moon.lunarPhase(selected?.selectedDate)}</div>
      </div>
    </div> */}
    </>
  );
};
