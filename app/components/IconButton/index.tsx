/*
import { IconButtonPreset, IconButtonPresetEnum, IconButtonVariant } from './IconButton';


  return (
    <div>
      <IconButtonPreset
        preset={IconButtonPresetEnum.download}
        variant={IconButtonVariant.highlight}
      />
    </div>
  );

*/

import React from 'react';
import styled from '@emotion/styled';
import { Icon } from '../Icons';
export enum IconButtonVariant {
    default = 'default',
    error = 'error',
    success = 'success',
    warning = 'warning',
    highlight = 'highlight',
  }
  
  export enum IconButtonPresetEnum {
    copy = 'copy',
    download = 'download',
  }
  
  type IconButtonPresetType = keyof typeof IconButtonPresetEnum;
  
  interface IconButtonBaseProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: IconButtonVariant;
    label?: string;
    customColor?: string;
    customSize?: string;
  }
  
  interface IconButtonDefaultProps extends IconButtonBaseProps {
    icon: React.ReactNode;
    altText: string;
  }
  
  interface IconButtonPresetProps extends IconButtonBaseProps {
    preset: IconButtonPresetType;
  }
  
  export const IconButtonPreset: React.FC<IconButtonPresetProps> = ({
    preset,
    variant = IconButtonVariant.default,
    customColor,
    customSize,
    ...props
  }) => {
    const presetDetails = {
      [IconButtonPresetEnum.copy]: {
        label: "Copy",
        altText: "Copy",
        icon: <Icon.Copy />,
      },
      [IconButtonPresetEnum.download]: {
        label: "Download",
        altText: "Download",
        icon: <Icon.Download />,
      },
    };
  
    const customStyle = {
      ...(customColor ? { '--IconButton-color': customColor } : {}),
      ...(customSize ? { '--IconButton-size': customSize } : {}),
    } as React.CSSProperties;
  
    const presetDetail = presetDetails[preset];
  
    return (
      <StyledIconButton
        className={`IconButton IconButton--${variant}`}
        title={presetDetail.altText}
        {...props}
        style={customStyle}
      >
        {presetDetail.label ? <span className="IconButton__label">{presetDetail.label}</span> : null}
        {presetDetail.icon}
      </StyledIconButton>
    );
  };
  
  IconButtonPreset.displayName = "IconButtonPreset";
  




interface IconButtonBaseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  label?: string;
  customColor?: string;
  customSize?: string;
}

interface IconButtonDefaultProps extends IconButtonBaseProps {
  icon: React.ReactNode;
  altText: string;
}

interface IconButtonPresetProps extends IconButtonBaseProps {
  preset: IconButtonPresetType;
}

const presetDetails = {
  [IconButtonPreset.copy]: {
    label: 'Copy',
    altText: 'Copy',
    icon: <Icon.Copy />,
  },
  [IconButtonPreset.download]: {
    label: 'Download',
    altText: 'Download',
    icon: <Icon.Download />,
  },
};

const StyledIconButton = styled.button<IconButtonBaseProps>`
  --IconButton-size: 1.25rem;
  --IconButton-color: ${props => props.variant === IconButtonVariant.default ? 'var(--pal-text-secondary)' : 
                                  props.variant === IconButtonVariant.error ? 'var(--pal-error)' : 
                                  props.variant === IconButtonVariant.success ? 'var(--pal-success)' : 
                                  props.variant === IconButtonVariant.warning ? 'var(--pal-warning)' : 
                                  props.variant === IconButtonVariant.highlight ? 'var(--pal-brand-primary)' : 
                                  'var(--pal-text-secondary)'};

  cursor: pointer;
  height: var(--IconButton-size);
  flex-shrink: 0;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: opacity var(--anim-transition-default);

  svg {
    width: var(--IconButton-size);
    height: var(--IconButton-size);
    fill: var(--IconButton-color);
  }

  .IconButton__label {
    color: var(--IconButton-color);
    margin-right: 0.5rem;
    font-weight: var(--font-weight-medium);
    font-size: max(1rem, calc(var(--IconButton-size) * 0.75));
  }

  &:hover {
    opacity: 0.6;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: var(--opacity-disabled-button);
  }
`;

export const IconButtonDefault: React.FC<IconButtonDefaultProps> = ({
  icon,
  altText,
  label,
  variant = IconButtonVariant.default,
  customColor,
  customSize,
  ...props
}) => {
  const customStyle = {
    ...(customColor ? { '--IconButton-color': customColor } : {}),
    ...(customSize ? { '--IconButton-size': customSize } : {}),
  } as React.CSSProperties;

  return (
    <StyledIconButton
      className={`IconButton IconButton--${variant}`}
      title={altText}
      {...props}
      style={customStyle}
    >
      {label ? <span className="IconButton__label">{label}</span> : null}
      {icon}
    </StyledIconButton>
  );
};

IconButtonDefault.displayName = "IconButtonDefault";


