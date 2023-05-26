import { useCalendar } from '@h6s/calendar';
import React from 'react';
import { format } from 'date-fns';
import { timesOfDay } from './constants';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { configResponsive, useResponsive } from 'ahooks';
import { DateTime } from 'luxon';
import { CalendarHeader } from './CalendarHeader'
configResponsive({
  sm: 0,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
});

type SubHeaderMobileDayProps = {
  containerNav: any;
  headers: any;
  navigation: any;
  cursorDate: any;
};
const SubHeaderMobileDay: React.FC<SubHeaderMobileDayProps> = ({
  containerNav,
  headers,
  navigation,
  cursorDate
}) => {
  return (
    <div
      ref={containerNav}
      className="sticky top-0 z-10 grid flex-none grid-cols-7 bg-neutral-800 text-xs text-neutral-500 shadow ring-1 ring-black ring-opacity-5 md:hidden"
    >
      {headers.weekDays.map(({ key, value }: any) => {
        const isToday =
          format(value, 'Y-MM-dd') === format(+new Date(), 'Y-MM-dd');
        const isSelected =
          format(cursorDate, 'Y-MM-dd') === format(value, 'Y-MM-dd')
            ? true
            : false;
        const buttonStyle = clsx(
          'mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold rounded-full',
          isToday && isSelected && 'bg-secondary-400 text-white',
          isToday && !isSelected && 'text-secondary-400',
          isSelected && 'bg-neutral-900 text-white',
          !isSelected && 'text-neutral-900'
        );
        return (
          <button
            type="button"
            className="flex flex-col items-center pt-3 pb-1.5"
            onClick={() => navigation.setDate(value)}
            key={key}
          >
            <span>{format(value, 'EEEEE')}</span>
            <span className={buttonStyle}>{format(value, 'd')}</span>
          </button>
        );
      })}
    </div>
  );
};

type DayViewProps = {
  headers: any;
  body: any;
  navigation: any;
  cursorDate: any;
  view: any;
  events: any;
  activeView: any;
};

export const DayView: React.FC<DayViewProps> = ({
  headers,
  body,
  navigation,
  cursorDate,
  activeView,
  events,
  view
}) => {
  const container = React.useRef<HTMLDivElement>(null);
  const containerNav = React.useRef<HTMLDivElement>(null);
  const containerOffset = React.useRef<HTMLDivElement>(null);
  const responsive = useResponsive();

  const { sm, md } = responsive;

  React.useEffect(() => {
    const currentMinute = new Date().getHours() * 60;
    if (
      typeof container.current?.scrollHeight === 'number' &&
      typeof containerNav.current?.offsetHeight === 'number' &&
      typeof containerOffset.current?.offsetHeight === 'number'
    ) {
      const x =
        container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight;
      window.scrollTo(0, (x * currentMinute) / 1440);
    }
  }, []);

  const eventsOnDate = events.filter((event: any) => {
    return format(cursorDate, 'DDD') ===
      format(new Date(event.timestamp * 1000), 'DDD')
      ? true
      : false;
  });

  React.useEffect(() => { 
    if (sm && !md) {
      view.showWeekView();
    } else if (md) {
      view.showMonthView();
    }
  }, [responsive]);

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <div className="flex flex-auto overflow-hidden bg-neutral-50">
        <div ref={container} className="flex flex-auto flex-col overflow-auto">
          <SubHeaderMobileDay
            containerNav={containerNav}
            headers={headers}
            navigation={navigation}
            cursorDate={cursorDate}
          />

          <div className="flex w-full flex-auto">
            <div className="w-14 flex-none bg-neutral-50 ring-1 ring-neutral-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-neutral-100"
                style={{
                  gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))'
                }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {timesOfDay.map(({ time }: any) => {
                  return (
                    <React.Fragment key={Math.random()} >
                      <div>
                        <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-neutral-400">
                          {time}
                        </div>
                      </div>
                      <div />
                    </React.Fragment>
                  );
                })}
                <div />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{
                  gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto'
                }}
              >
                {eventsOnDate.length > 0 &&
                  eventsOnDate.map((event: any) => {
                    const start = DateTime.fromSeconds(parseInt(event.timestamp)), end = DateTime.fromSeconds(parseInt(event.timestamp) + parseInt(event.duration));
                    const start_time = (parseInt(start.toFormat('HH')) * 60 + parseInt(start.toFormat('mm'))) / 5 + 2;
                    const startTime = start.toFormat('HH:mm'), endTime = end.toFormat('HH:mm');
                    return (
                      <li
                        className="relative mt-px flex"
                        style={{
                          gridRow: `${start_time} / span ${event.duration / 60 / 5}`
                        }}
                        key={event.name}
                      >
                        <a
                          href="#"
                          className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                        >
                          <p className="order-1 font-semibold text-blue-700">
                            {event.name}
                          </p>
                          <p className="text-blue-500 group-hover:text-blue-700">
                            <time dateTime="2022-01-22T06:00">
                              {/* {event} */}
                            </time>
                          </p>
                        </a>
                      </li>
                    );
                  })}
              </ol>
            </div>
          </div>
        </div>
        <div className="hidden w-1/2 max-w-md flex-none border-l border-neutral-100 py-10 px-8 md:block">
          <div className="flex items-center text-center text-neutral-900">
            <button
              type="button"
              onClick={() => navigation.toPrev()}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-neutral-400 hover:text-neutral-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex-auto font-semibold">
              {format(cursorDate, 'MMMM Y')}
            </div>
            <button
              type="button"
              onClick={() => navigation.toNext()}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-neutral-400 hover:text-neutral-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-center text-xs leading-6 text-neutral-500">
            {headers.weekDays.map(({ key, value }: any) => {
              return <div key={key}>{format(value, 'EEEEE')}</div>;
            })}
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-neutral-200 text-sm shadow ring-1 ring-neutral-200">
            {body.value.map(({ key, value: weeks }: any) => (
              <React.Fragment key={key}>
                {weeks.map(
                  ({
                    key,
                    value: day,
                    date,
                    isCurrentDate,
                    isCurrentMonth
                  }: any) => {
                    const isSelected =
                      format(cursorDate, 'Y-MM-dd') === format(day, 'Y-MM-dd')
                        ? true
                        : false;

                    const dayStyle = clsx(
                      'flex flex-col items-center pt-[10px] pb-[10px]',
                      'hover:bg-primary-400 hover:transition-opacity duration-300 ease-out focus:z-10',
                      isCurrentMonth ? 'bg-neutral-100' : 'bg-neutral-50',
                      (isSelected || isCurrentDate) && 'font-semibold',
                      isSelected && 'text-neutral-50',
                      !isSelected &&
                        isCurrentMonth &&
                        !isCurrentDate &&
                        'text-neutral-900',
                      !isSelected &&
                        !isCurrentMonth &&
                        !isCurrentDate &&
                        'text-neutral-400',
                      isCurrentDate && !isSelected && 'text-primary-400',
                      body.value[0]['value'][0]['value'] === day &&
                        'rounded-tl-lg',
                      body.value[0]['value'][6]['value'] === day &&
                        'rounded-tr-lg',
                      body.value[body.value.length - 1]['value'][0]['value'] ===
                        day && 'rounded-bl-lg',
                      body.value[body.value.length - 1]['value'][6]['value'] ===
                        day && 'rounded-br-lg'
                    );
                    const buttonStyle = clsx(
                      'flex h-[32px] w-[32px] p-2 items-center justify-center rounded-full',
                      isSelected && isCurrentDate && 'bg-primary-400',
                      isSelected &&
                        !isCurrentDate &&
                        'bg-neutral-900 transition-opacity duration-100'
                    );
                    return (
                      <button
                        key={key}
                        type="button"
                        className={dayStyle}
                        onClick={() => navigation.setDate(day)}
                      >
                        <time
                          dateTime={format(day, 'dd')}
                          className={buttonStyle}
                        >
                          {format(day, 'dd')}
                        </time>
                      </button>
                    );
                  }
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};



export const CalendarDay: React.FC<CalendarProps> = ({ events = [], CTA }) => {
  const [activeView, changeView] = React.useState('month');
  const { cursorDate, headers, body, view, navigation } = useCalendar();

  const setView = (option: string) => {
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

  const bodyStyle = clsx(
    activeView === 'month' && 'flex flex-col',
    (activeView === 'week' || activeView === 'day') && 'flex flex-col h-screen'
  );
  return (
    <>
      <div className={bodyStyle}>
        <CalendarHeader
          activeView={activeView}
          setView={setView}
          view={view}
          CTA={CTA}
          cursorDate={cursorDate}
          navigation={navigation}
        />
        <DayView
            headers={headers}
            body={body}
            events={events}
            activeView={activeView}
            navigation={navigation}
            cursorDate={cursorDate}
            view={view}
          />
        </div>
      </>)
      }