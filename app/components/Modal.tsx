import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import clsx from 'clsx';
import type { ModalProps } from '~/types';
// import { XIcon, ArrowsExpandIcon } from '@heroicons/react/outline';



export const Modal: React.FC<ModalProps> = ({
  children,
  initialState,
  padding = 'small',
  size = 'small',
  align = 'center',
  overlay = false,
  showBar = false,
  overflow = false,
  closeModal,
  closable = true,
  theme
}) => {
  const cancelButtonRef = React.useRef(null);
  const [expanded, setExpanded] = React.useState(false);
  const modalStyle = clsx(
    `${theme} inline-block`,
    size === 'small' && 'w-full max-w-md',
    size === 'medium' && 'w-full max-w-2xl',
    size === 'large' && 'w-full max-w-4xl',
    size === 'fit' && 'w-fit',
    align === 'right' && 'mr-[20px]',
    expanded && 'max-w-full h-screen',
    !expanded && 'rounded-[20px] p-[4px]',
    `text-left align-middle transition-all transform shadow-xl`
  );

  const containerStyle = clsx(
    padding === 'small' && 'p-2',
    padding === 'medium' && 'p-4',
    padding === 'large' && 'p-[40px]'
  );

  const barStyle = clsx(
    !expanded && 'rounded-tl-[16px] rounded-tr-[16px]',
    'bg-neutral-100 w-full h-8 flex p-2'
  );

  return (
    <>
      <Transition.Root show={initialState} as={Fragment}>
        <Dialog
          as="div"
          auto-reopen="true"
          className="fixed inset-0 z-10 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={(value: boolean) => {
            if (closable && closeModal) {
              closeModal();
            }
          }}
        >
          <div className={`block items-end justify-end min-h-screen ${align === 'center' ? 'text-center' : 'text-right'}`}>
            {/* Background Animation */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* Background Color */}
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-md" />
            </Transition.Child>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            ></span>
            {/* Modal Animation */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-40"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-40"
            >
              {/* Modal Style */}
              <Dialog.Panel className={modalStyle}>
                <div className={`bg-[#2c2a57] ${!expanded ? 'rounded-[16px]': 'h-full'} ${!!overflow ? 'overflow-hidden' : ''}`}>
                  {/* Modal Options */}
                  {showBar && (
                    <div className={barStyle}>
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start">
                          <button
                            type="button"
                            className="bg-red-400 text-red-400 rounded-full p-1 hover:text-red-100 hover:bg-red-500 focus:outline-none"
                            onClick={closeModal}
                          >
                            <span className="sr-only">Close</span>
                            {/* <XIcon className="w-3 h-3" aria-hidden="true" /> */}
                          </button>
                          <button
                            type="button"
                            className="ml-2 bg-green-400 text-green-400 rounded-full p-1 hover:text-green-100 hover:bg-green-500 focus:outline-none"
                            onClick={() => setExpanded(!expanded)}
                          >
                            <span className="sr-only">Close</span>
                            {/* <ArrowsExpandIcon
                              className="w-3 h-3"
                              aria-hidden="true"
                            /> */}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={containerStyle}>
                    <div className={ padding === 'none' ? '' : 'mt-4'}>{children}</div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
