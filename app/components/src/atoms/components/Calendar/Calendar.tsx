import React from 'react';
import { CalendarViewType, useCalendar } from '@h6s/calendar';
import { format } from 'date-fns';
import clsx from 'clsx';
import { ClockIcon } from '@heroicons/react/solid';
import { WeekView } from './CalendarWeek';
import { DayView } from './CalendarDay';
import { MonthDesktop, MonthMobile } from './CalendarMonth';
import { CalendarHeader } from './CalendarHeader';
// Add moonphases to the calendar.
// import { Moon } from 'lunarphase-js';

export const Calendar: React.FC<CalendarProps> = ({ events = [], CTA, openModal, defaultView = 'month' }) => {
  const [activeView, changeView] = React.useState(defaultView);
  
  const { cursorDate, headers, body, view, navigation } = useCalendar({defaultViewType: CalendarViewType.Month });

  const setView = (option: defaultView) => {
    changeView(option);
    switch (option) {
      case 'month':
        return view.showMonthView();
      case 'day':
        return view.showMonthView();
      case 'week':
        return view.showWeekView();
    }
  };

  // React.useEffect, populate events, watch [view]
  const eventsOnDate = events.filter((event: any) => {
    return format(cursorDate, 'DDD') ===
      format(new Date(event.timestamp * 1000), 'DDD')
      ? true
      : false;
  });


  // React.useEffect(() => {
  //   console.log('activeView', activeView)
  //   if (!activeView) {
  //     view.showMonthView();
  //   }
  //   if (defaultView === 'week') {
  //     view.showWeekView();
  //   }
  // }, [activeView])

  const bodyStyle = clsx(
    activeView === 'month' && 'flex flex-col h-[800px]',
    (activeView === 'week' || activeView === 'day') && 'flex flex-col h-v92'
  );

  return (
    <>
      <div className={bodyStyle}>
        <CalendarHeader
          CTA={CTA}
          activeView={activeView}
          setView={setView}
          view={view}
          cursorDate={cursorDate}
          navigation={navigation}
        />
        {activeView === 'month' && (
          <>
            <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
              <div className="grid grid-cols-7 gap-px text-center text-xs font-semibold leading-6 text-neutral-700 lg:flex-none">
                {headers.weekDays.map(({ value }, key: any) => {
                  const day = format(value, 'eee');
                  return (
                    <div className="py-2" key={key}>
                      {day.charAt(0)}
                      <span className="sr-only sm:not-sr-only">
                        {day.slice(1, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex bg-neutral-300 p-[1px] text-xs leading-6 text-neutral-700 lg:flex-auto rounded-[20px] mb-[40px]">
                <div className={`hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-${body.value.length} lg:gap-px`}>
                  {body.value.map(({ key, value: weeks }) => (
                    <MonthDesktop
                      openModal={openModal}
                      key={key}
                      body={body}
                      weeks={weeks}
                      events={events}
                      activeDate={cursorDate}
                      navigation={navigation}
                    />
                  ))}
                </div>
                <div className="isolate grid w-full grid-cols-7 grid-rows-5 gap-px lg:hidden">
                  {body.value.map(({ key, value: weeks }) => (
                    <MonthMobile
                      openModal={openModal}
                      key={key}
                      body={body}
                      weeks={weeks}
                      events={events}
                      activeDate={cursorDate}
                      navigation={navigation}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {activeView === 'week' && (
          <WeekView
            headers={headers}
            body={body}
            events={events}
            navigation={navigation}
            cursorDate={cursorDate}
            view={view}
          />
        )}
        {activeView === 'day' && (
          <DayView
            headers={headers}
            body={body}
            events={events}
            activeView={activeView}
            navigation={navigation}
            cursorDate={cursorDate}
            view={view}
          />
        )}
        {activeView === 'month' && eventsOnDate.length > 0 && (
          <div className="py-10 px-4 sm:px-6 lg:hidden">
            <ol className="divide-y divide-neutral-100 overflow-hidden rounded-lg bg-neutral-100 text-sm shadow ring-1 ring-black ring-opacity-5">
              {eventsOnDate.map((event: any) => (
                <li
                  key={event.id}
                  className="group flex p-4 pr-6 focus-within:bg-neutral-50 hover:bg-neutral-50"
                >
                  <div className="flex-auto">
                    <p className="font-semibold text-neutral-900">{event.name}</p>
                    <time
                      dateTime={format(
                        new Date(event.timestamp * 1000),
                        'P pppp'
                      )}
                      className="mt-2 flex items-center text-neutral-700"
                    >
                      <ClockIcon
                        className="mr-2 h-5 w-5 text-neutral-400"
                        aria-hidden="true"
                      />
                      {format(new Date(event.timestamp * 1000), 'hh bbbb')}
                    </time>
                  </div>
                  <a
                    href={event.href}
                    className="ml-6 flex-none self-center rounded-md border border-neutral-900 bg-neutral-100 py-2 px-3 font-semibold text-neutral-700 opacity-0 shadow-sm hover:bg-neutral-50 focus:opacity-100 group-hover:opacity-100"
                  >
                    Edit<span className="sr-only">, {event.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
};
