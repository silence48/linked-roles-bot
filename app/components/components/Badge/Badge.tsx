import clsx from 'clsx';
import React from 'react';

type BadgeProps = {
  title: string;
  variant?: string;
  size?: string;
};

export const Badge: React.FC<BadgeProps> = ({ title, variant = 'secondary', size = 'small' }) => {
  const style = clsx(
    size === 'small' && 'py-[4px] px-[8px] text-caption-bold',
    size === 'large' && 'py-[4px] px-[8px] text-caption-bold',
    variant === 'secondary' && 'bg-secondary-300 text-neutral-800',
    'inline-flex items-center rounded-[4px] font-medium'
  );

  return (
    <>
      <span className={style}>
        {title}
        {/* <button
          type="button"
          className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-secondary-400 hover:bg-secondary-200 hover:text-secondary-500 focus:outline-none focus:bg-secondary-500 focus:text-white"
        >
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </button> */}
      </span>
    </>
  );
};

// <span className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-secondary-100 text-secondary-700">
//         Large
//         <button
//           type="button"
//           className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-secondary-400 hover:bg-secondary-200 hover:text-secondary-500 focus:outline-none focus:bg-secondary-500 focus:text-white"
//         >
//           <svg
//             className="h-2 w-2"
//             stroke="currentColor"
//             fill="none"
//             viewBox="0 0 8 8"
//           >
//             <path
//               strokeLinecap="round"
//               strokeWidth="1.5"
//               d="M1 1l6 6m0-6L1 7"
//             />
//           </svg>
//         </button>
//       </span>
