import React from 'react';

const monthNamesShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const weekdayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type CalendarProps = {
  calendars: any;
  getBackProps: any;
  getForwardProps: any;
  getDateProps: any;
  onDateSelected: any;
  // children: React.ReactNode;
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    { calendars, getBackProps, getForwardProps, getDateProps, onDateSelected },
    forwarededRef
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    React.useImperativeHandle(
      forwarededRef,
      () => ref.current as HTMLDivElement
    );

    if (calendars.length) {
      return (
        <>
          {calendars.map((calendar: any, key: any) => (
            <div className="flex items-center justify-center" key={key}>
              <div className="w-full">
                <div className="flex items-center justify-between leading-8">
                  <h1 className="font-medium text-neutral-800">
                    {monthNamesShort[calendar.month]} {calendar.year}
                  </h1>
                  <div className="flex items-center text-neutral-800">
                    <button {...getBackProps({ calendars })} type="button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-chevron-left"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <polyline points="15 6 9 12 15 18" />
                      </svg>
                    </button>
                    <button {...getForwardProps({ calendars })} type="button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler ml-3 icon-tabler-chevron-right"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 overflow-x-auto ">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {weekdayNamesShort.map((weekday, key) => (
                          <th key={key}>
                            <div className="w-full flex justify-center">
                              <p className=" font-medium text-center text-neutral-800">
                                {weekday}
                              </p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calendar.weeks.map((week: any, weekIndex: any) => {
                        return (
                          <tr key={weekIndex}>
                            {week.map((dateObj: any, index: any) => {
                              const key = `${calendar.month}${calendar.year}${weekIndex}${index}`;
                              if (!dateObj) {
                                return (
                                  <td className="p-0.5" key={key}>
                                    <div className="cursor-pointer flex w-full justify-center" />
                                  </td>
                                );
                              }
                              let {
                                date,
                                selected,
                                selectable,
                                today
                              } = dateObj;

                              // console.log('Date is', date)
                              let background = today
                                ? 'text-primary-400'
                                : 'transparent';
                              background = selected
                                ? 'bg-secondary-400 text-neutral-800'
                                : background;
                              background = !selectable
                                ? 'bg-primary-100 text-neutral-800' 
                                : background;
                              return (
                                <td className="p-0.5" key={key}>
                                  <div className="cursor-pointer flex w-full justify-center">
                                    <div>
                                      <button
                                        type="button"
                                        className={`w-10 h-10 flex items-center justify-center font-medium text-neutral-800 ${background} rounded-full`}
                                        {...getDateProps({ dateObj })}
                                        onClick={() => onDateSelected(dateObj)}
                                      >
                                        {selectable ? date.getDate() : 'X'}
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </>
      );
    }
    return null;
  }
);
