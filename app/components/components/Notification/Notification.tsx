/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';

type ContentProps = {
  title: string;
  status: number
}
type NotificationProps = {
  content: ContentProps;
  initialState: boolean;
  closeNotification(): void;
};
export const Notification: React.FunctionComponent<NotificationProps> = ({
  content,
  initialState,
  closeNotification
}) => {
  const { title } = content;
  return (
    <>
      <div
        aria-live="assertive"
        className="fixed bottom-0 w-full items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className="w-full flex flex-col items-center space-y-4 drop-shadow">
          <Transition
            show={initialState}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="transition-opacity duration-500 max-w-[400px] w-full bg-neutral-100 shadow-lg rounded-[20px] pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="p-[20px]">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {/* <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    /> */}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-neutral-900"></p>
                    <p className="mt-1 text-paragraph-large-medium text-center text-neutral-700">{title}</p>
                  </div>
                  {/* <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="rounded-md inline-flex text-neutral-700 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        closeNotification();
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
};
