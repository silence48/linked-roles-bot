import React from 'react';
import clsx from 'clsx';
import { Menu, Popover } from '@headlessui/react';

import { Icon, type IconKeys } from './Icon';

type ButtonProps = {
  text?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'basic'
    | 'outline'
    | 'alert'
    | 'warning'
    | 'positive'
    | 'dropdown';
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  type?: 'submit' | 'button' | 'link' | 'menu' | 'action' | 'upload' | 'popover';
  as?: 'button' | 'div';
  icon?: IconKeys;
  to?: string;
  rounded?: 'small' | 'medium' | 'full';
  onClick?: () => void;
  startUpload?: (e: any) => void;
  isLoaded?: boolean;
  customCss?: string;
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  component?: React.ElementType;
};

export const Button: React.FunctionComponent<ButtonProps> = ({
  text,
  variant = 'primary',
  component: Component,
  size = 'medium',
  type = 'button',
  as = 'button',
  rounded,
  icon = undefined,
  onClick,
  startUpload,
  disabled = false,
  to,
  customCss = '',
  loading = false,
  active = false,
}) => {
  
  const buttonStyle = clsx(
    `transition ease-in-out delay-75 duration-300 inline-flex justify-center cursor-pointer flex items-center justify-center font-bold`,
    variant === 'primary' && `${active ? 'bg-primary-800' : 'bg-primary-700'} text-neutral-100 border border-primary-700
    outline-none hover:outline-none hover:bg-primary-800 hover:text-primary-100 hover:border-[1px] hover:border-primary-200
    hover:ring-[2px] hover:ring-primary-700 hover:ring-offset-neutral-50
    focus:outline-none focus:bg-primary-800 focus:text-primary-100 focus:border-[1px] focus:border-primary-200
    focus:ring-[2px] focus:ring-primary-700 focus:ring-offset-neutral-50`,
    variant === 'secondary' && `bg-secondary-700 text-neutral-100 border border-secondary-700
    hover:outline-none hover:bg-secondary-800 hover:text-secondary-100 hover:border-[1px] hover:border-secondary-200
    hover:ring-[2px] hover:ring-secondary-700 hover:ring-offset-neutral-50
    focus:outline-none focus:bg-secondary-800 focus:text-secondary-100 focus:border-[1px] focus:border-secondary-200
    focus:ring-[2px] focus:ring-secondary-700 focus:ring-offset-neutral-50`,
    variant === 'basic' && `text-neutral-1100 hover:outline-none focus:outline-none hover:text-primary-700 focus:text-primary-800`,
    variant === 'warning' && `bg-red-700 text-neutral-100 border border-red-700
    hover:outline-none hover:bg-red-800 hover:text-red-100 hover:border-[1px] hover:border-red-200  
    hover:ring-[2px] hover:ring-red-700 hover:ring-offset-neutral-50
    focus:outline-none focus:bg-red-800 focus:text-red-100 focus:border-[1px] focus:border-red-200
    focus:ring-[2px] focus:ring-red-700 focus:ring-offset-neutral-50`,
    variant === 'positive' && `bg-green-700 text-neutral-100 border border-green-700
    hover:outline-none hover:bg-green-600 hover:text-green-200 hover:border-[1px] hover:border-green-200  
    hover:ring-[2px] hover:ring-green-700 hover:ring-offset-neutral-50
    focus:outline-none focus:bg-green-600 focus:text-green-200 focus:border-[1px] focus:border-green-200
    focus:ring-[2px] focus:ring-green-700 focus:ring-offset-neutral-50`,
    variant === 'outline' && `border bg-neutral-50 border-neutral-700 text-neutral-1100
    hover:outline-none hover:bg-neutral-800 hover:text-neutral-100 hover:border-[1px] hover:border-neutral-200
    hover:ring-[2px] hover:ring-neutral-700 hover:ring-offset-neutral-50
    focus:outline-none focus:bg-neutral-800 focus:text-neutral-100 focus:border-[1px] focus:border-neutral-200
    focus:ring-[2px] focus:ring-neutral-700 focus:ring-offset-neutral-50`,
    variant === 'dropdown' && `border bg-neutral-50 border-neutral-700 text-neutral-800
    hover:outline-none hover:bg-neutral-800 hover:text-neutral-100 hover:border-[1px] hover:border-neutral-200
    hover:ring-[2px] hover:ring-neutral-700 hover:ring-offset-neutral-50
    focus:outline-none focus:bg-neutral-800 focus:text-neutral-100 focus:border-[1px] focus:border-neutral-200
    focus:ring-[2px] focus:ring-neutral-700 focus:ring-offset-neutral-50`,
    text &&
      size === 'tiny' &&
      'px-[8px] py-[6px] text-button-tiny font-medium tracking-wide rounded-[4px] focus:ring-offset-[1px]  hover:ring-offset-[1px]',
    text &&
      size === 'small' &&
      'px-[10px] py-[8px] text-button-small font-medium tracking-wide rounded-[6px] focus:ring-offset-[1px]  hover:ring-offset-[1px]',
    text &&
      size === 'medium' &&
      'px-[16px] py-[12px] text-button-medium font-bold tracking-wide rounded-[10px] focus:ring-offset-[2px]  hover:ring-offset-[2px]',
    text &&
      size === 'large' &&
      'px-[30px] py-[13px]  text-button-large font-bold rounded-[12px] focus:ring-offset-[3px]  hover:ring-offset-[3px]',
    text &&
      size === 'xlarge' &&
      'px-[30px] py-[8.001px]  text-[24px] font-bold rounded-[12px] focus:ring-offset-[4px]  hover:ring-offset-[4px]',
    !!icon && !!text && size === 'tiny' && 'py-[4px]',
    !!icon && !!text && size === 'small' && 'py-[5.5px]',
    !!icon && !!text && size === 'medium' && 'py-[7px]',
    !!icon && !!text && size === 'large' && 'py-[7.5px]',
    !!icon && !!text && size === 'xlarge' && 'py-[7.5px]',
    type === 'action' && size === 'tiny' && 'h-[26px]',
    type === 'action' && size === 'small' && 'h-[33px]',
    type === 'action' && size === 'medium' && 'h-[44px]',
    type === 'action' && size === 'large' && 'h-[51px]',
    type === 'action' && size === 'xlarge' && 'h-[51px]',
    !!icon && !text && size === 'tiny' && 'px-[4px] py-[4px] rounded-[4px]',
    !!icon && !text && size === 'small' && 'px-[5.5px] py-[5.5px] rounded-[6px]',
    !!icon && !text && size === 'medium' && 'px-[7px] py-[7px] rounded-[10px]',
    !!icon && !text && size === 'large' && 'px-[7.5px] py-[7.5px] rounded-[12px]',
    !!icon && !text && size === 'xlarge' && 'px-[8px] py-[8px] rounded-[12px]',
    rounded === 'small' && `rounded-[4px]`,
    rounded === 'medium' && `rounded-md`,
    rounded === 'full' && `rounded-full`,
    disabled && 'cursor-not-allowed bg-neutral-100 hover:bg-neutral-150',
    `${customCss}`
  );

  const dropdownStyle = clsx(
    `${active ? 'bg-neutral-150 text-neutral-800' : 'text-neutral-600'}`,
    disabled && 'cursor-not-allowed bg-neutral-100 hover:bg-neutral-100', 
    `group flex items-center py-[8px] px-[16px]  text-sm
    hover:outline-none hover:bg-neutral-100 hover:text-primary-400
    hover:ring-[1px] hover:ring-primary-200 hover:ring-offset-neutral-50
    focus:outline-none focus:bg-neutral-100 focus:text-primary-400
    focus:ring-[1px] focus:ring-primary-200 focus:ring-offset-neutral-50
    w-full ${customCss}`
  );

  const spanStyle = clsx(
    'contents align-middle',
    text && size === 'tiny' && 'h-[14px]',
    text && size === 'small' && 'h-[17px]',
    text && size === 'medium' && 'h-[20px]',
    text && size === 'large' && 'h-[25px]',
    text && size === 'xlarge' && 'h-[30px]',
    !!icon && !!text && size === 'tiny' && 'pt-[1px]'
  );

  const iconStyle = clsx(
    !!icon && !!text && size === 'tiny' && 'pr-[3px] hover:fill-black',
    !!icon && !!text && size === 'small' && 'pr-[4.5px] fill-white',
    !!icon && !!text && size === 'medium' && 'pr-[6px] hover:fill-black',
    !!icon && !!text && size === 'large' && 'pr-[6.5px] hover:fill-black',
    !!icon && !!text && size === 'xlarge' && 'pr-[7px] hover:fill-black',
    !!icon && !text && size === 'tiny' && '',
    !!icon && !text && size === 'small' && '',
    !!icon && !text && size === 'medium' && '',
    !!icon && !text && size === 'large' && '',
    !!icon && !text && size === 'xlarge' && ''
  );

  const handleClick = () => {
    // runSound()
    if (onClick) onClick();
  };

  const runSound = () => {
    const audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3')
    audio.play();
  }

  if (type === 'menu')
    return (
      <Menu.Button className={buttonStyle} disabled={disabled}>
        {!!icon && !loading ?
          <div className={iconStyle}>
            <Icon
              name={icon}
              size={size}
            />
          </div>
          : loading && <div className="pr-[8px]">
              <div className="origin-center animate-spin">
                <Icon name="spinner" size={size} viewBox="0 0 16 16" />
              </div>
            </div>
          }
        {text && <span className={spanStyle}>{text}</span>}
      </Menu.Button>
    );
  if (type === 'popover')
    return (
      <Popover.Button className={buttonStyle} disabled={disabled}>
        {!!icon && !loading ?
          <div className={iconStyle}>
            <Icon
              name={icon}
              size={size}
            />
          </div>
          : loading && <div className="pr-[8px]">
              <div className="origin-center animate-spin">
                <Icon name="spinner" size={size} viewBox="0 0 16 16" />
              </div>
            </div>
          }
        {text && <span className={spanStyle}>{text}</span>}
      </Popover.Button>
    );
  if (type === 'submit')
    return <button type="submit" className={buttonStyle}>
          {!!icon && !loading ?
          <div className={iconStyle}>
            <Icon
              name={icon}
              size={size}
            />
          </div>
          : loading && <div className="pr-[8px]">
              <div className="origin-center animate-spin">
                <Icon name="spinner" size={size} viewBox="0 0 16 16" />
              </div>
            </div>
          }
        {text && <span className={spanStyle}>{text}</span>}
      </button>
  if (type === 'action')
    return (
      <form className="inline">
        <button
          type="submit"
          formAction={to}
          formMethod="post"
          className={variant === 'dropdown' ? dropdownStyle : buttonStyle}
          disabled={disabled}
        >
          {!!icon && !loading ?
            <div className={iconStyle}>
              <Icon
                name={icon}
                size={size}
              />
            </div>
            : loading && <div className="pr-[8px]">
              <div className="origin-center animate-spin">
                <Icon name="spinner" size={size} viewBox="0 0 16 16" />
              </div>
            </div>
          }
          {text && <span className={spanStyle}>{text}</span>}
        </button>
      </form>
    )
  if (type === 'link' && !!Component)
    return (
      <Component
        to={!disabled ? to : '#'}
        className={variant === 'dropdown' ? dropdownStyle : buttonStyle}
        disabled={disabled}
      >
        {!!icon && !loading ?
          <div className={iconStyle}>
            <Icon
              name={icon}
              size={size}
            />
          </div>
          : loading && <div className="pr-[8px]">
              <div className="origin-center animate-spin">
                <Icon name="spinner" size={size} viewBox="0 0 16 16" />
              </div>
            </div>
          }
        {text && <span className={spanStyle}>{text}</span>}
      </Component>
    );
  if (type === 'upload' && !!startUpload)
    return (
      <>
        <div
          className="pt-4"
        >
        <label
          htmlFor="file-upload"
          className={buttonStyle}
        >
          {!!icon && !loading ?
            <div className={iconStyle}>
              <Icon
                name={icon}
                size={size}
              />
            </div>
            : loading && <div className="pr-[8px]">
              <div className="origin-center animate-spin">
                <Icon name="spinner" size={size} viewBox="0 0 16 16" />
              </div>
            </div>
          }
          {text && <span className={spanStyle}>{text}</span>}
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            disabled={disabled}
            className="sr-only"
            onChange={(e) => startUpload(e)}
          />
        </label>
      </div>
    </>
    )
  if (as === 'div')
    return (
      <div className={variant === 'dropdown' ? dropdownStyle : buttonStyle}>
        {!!icon && !loading ?
          <div className={iconStyle}>
            <Icon
              name={icon}
              size={size}
            />
          </div>
          : loading && <div className="pr-[8px]">
          <div className="origin-center animate-spin">
            <Icon name="spinner" size={size} viewBox="0 0 16 16" />
          </div>
        </div>
        }
        {text && <span className={spanStyle}>{text}</span>}
      </div>
    );
  return (
    
    <button
      type="button"
      // onMouseOver={() => runSound()}
      className={variant === 'dropdown' ? dropdownStyle : buttonStyle}
      onClick={() => handleClick()}
      disabled={disabled}
    >
        {!!icon && !loading ?
          <div className={iconStyle}>
            <Icon
              name={icon}
              size={size}
            />
          </div>
          : loading && <div className="pr-[8px]">
              <div className="origin-center animate-spin">
                <Icon name="spinner" size={!icon ? 'tiny' : size} viewBox="0 0 16 16" />
              </div>
            </div>
          }
        {text && <span className={spanStyle}>{text}</span>}
    </button>
  );
};
