import React from 'react';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { Dropdown } from '../Dropdown';

type HeaderProps = {
  activeView: string;
  setView: any;
  view: any;
  cursorDate: any;
  CTA?: React.ReactNode;
  navigation: any;
};

export const CalendarHeader: React.FC<HeaderProps> = ({
  activeView,
  setView,
  view,
  cursorDate,
  CTA,
  navigation
}) => {
  const userNavigation: any = [
    {
      text: 'Month',
      type: 'button',
      action: () => setView('month')
    },
    { text: 'Day', type: 'button', action: () => setView('day') },
    { text: 'Week', type: 'button', action: () => setView('week') }
  ];
  return (
    <>
      <header className="relative flex items-center justify-between pt-[16px] pb-[24px] sm:px-6 lg:px-8 lg:flex-none">
        <div className="text-lg font-semibold text-neutral-900">
          {activeView === 'day' ? (
            <>
              <h1 className="text-lg font-semibold leading-6 text-neutral-900">
                <time dateTime="2022-01-22" className="sm:hidden">
                  {format(cursorDate, 'MMM d, Y')}
                </time>
                <time dateTime="2022-01-22" className="hidden sm:inline">
                  {format(cursorDate, 'MMMM d, Y')}
                </time>
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {format(cursorDate, 'eeee')}
              </p>
            </>
          ) : (
            <time dateTime={format(cursorDate, 'Y-MMMM')}>
              {format(cursorDate, 'MMMM Y')}
            </time>
          )}
        </div>
        <div className="flex items-center space-x-[16px]">
          <div>{CTA}</div>

          <div className="flex items-center rounded-md shadow-sm md:items-stretch text-button-tiny h-[28px]">
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md border border-r-0 border-neutral-400 bg-neutral-50 py-2 pl-3 pr-4 text-neutral-400 hover:text-neutral-500 focus:relative md:w-9 md:px-2 md:hover:bg-neutral-50"
              onClick={() => navigation.toPrev()}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-t border-b border-neutral-400 bg-neutral-50 px-3.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-400 focus:relative md:block"
              onClick={() => navigation.setToday()}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-neutral-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md border border-l-0 border-neutral-400 bg-neutral-50 py-2 pl-4 pr-3 text-neutral-400 hover:text-neutral-500 focus:relative md:w-9 md:px-2 md:hover:bg-neutral-50"
              onClick={() => navigation.toNext()}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="md:flex md:items-center">
            <div className="right-0 origin-top-right">
              <Dropdown
                items={userNavigation}
                button={{
                  icon: 'dots',
                  name: activeView,
                  size: 'tiny',
                  variant: 'outline'
                }}
              ></Dropdown>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
