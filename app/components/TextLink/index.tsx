/*
example:
import { TextLink, TextLinkVariant } from './TextLink';

  return (
    <div>
      <TextLink
        href="https://example.com"
        variant={TextLinkVariant.primary}
        underline
      >
        Primary Link
      </TextLink>
      <TextLink
        href="https://example.com"
        variant={TextLinkVariant.secondary}
      >
        Secondary Link
      </TextLink>
    </div>
  );

*/
import React from 'react';
import styled from '@emotion/styled';
import { ButtonIcon, ButtonIconPosition } from '../utils/ButtonIcon';

export enum TextLinkVariant {
  primary = 'primary',
  secondary = 'secondary',
}

interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  variant?: TextLinkVariant;
  disabled?: boolean;
  underline?: boolean;
  children: string | React.ReactNode;
}

const StyledTextLink = styled.a<TextLinkProps>`
  --TextLink-color-text: transparent;
  color: var(--TextLink-color-text);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  vertical-align: bottom;
  transition: color var(--anim-transition-default);

  &.TextLink--primary {
    --TextLink-color-text: var(--sds-c-text-link);

    &:hover {
      --TextLink-color-text: var(--sds-c-text-link-hover);
    }

    body.sds-theme-dark & {
      --TextLink-color-text: var(--sds-c-text-900);

      &:hover {
        --TextLink-color-text: var(--sds-c-text-900);
      }
    }
  }

  &.TextLink--secondary {
    --TextLink-color-text: var(--sds-c-text-primary);

    &:hover {
      --TextLink-color-text: var(--sds-c-text-secondary);
    }

    body.sds-theme-dark & {
      --TextLink-color-text: var(--sds-c-text-500);

      &:hover {
        --TextLink-color-text: var(--sds-c-text-500);
      }
    }
  }
  &.TextLink--underline {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }

    body.sds-theme-dark & {
      --TextLink-color-text: var(--sds-c-text-500);

      &:hover {
        --TextLink-color-text: var(--sds-c-text-500);
      }
    }
  }

  &.TextLink--disabled {
    cursor: not-allowed;
    opacity: var(--opacity-disabled-button);

    &.TextLink--underline {
      text-decoration: underline;
    }

    body.sds-theme-dark & {
      --TextLink-color-text: var(--sds-c-text-500);
    }
  }
  .ButtonIcon {
    --ButtonIcon-gap: 0.25rem;

    svg {
      transition: fill var(--anim-transition-default),
        stroke var(--anim-transition-default);
      stroke: var(--TextLink-color-text);
    }
  }

  .Loader {
    --Loader-color: var(--TextLink-color-text);
    margin-left: 0.5rem;
  }
`;

export const TextLink: React.FC<TextLinkProps> = ({
  iconLeft,
  iconRight,
  variant = TextLinkVariant.primary,
  disabled,
  underline,
  children,
  ...props
}) => {
  const { href, onClick } = props;
  const isExternalLink = href?.startsWith('http') || href?.startsWith('//');

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (onClick && !disabled) {
      event.preventDefault();
      onClick(event);
    }
  };

  const customProps = {
    ...(isExternalLink && !disabled
      ? { rel: 'noreferrer noopener', target: '_blank' }
      : {}),
    ...(href && disabled ? { href: undefined } : { href }),
    ...(onClick
      ? {
          onClick: handleClick,
          role: 'button',
        }
      : {}),
  };

  const additionalClasses = [
    ...(underline ? ['TextLink--underline'] : []),
    ...(disabled ? ['TextLink--disabled'] : []),
  ].join(' ');

  return (
    <StyledTextLink
      className={`TextLink TextLink--${variant} ${additionalClasses}`}
      {...props}
      {...customProps}
    >
      {iconLeft ? (
        <ButtonIcon position={ButtonIconPosition.left}>{iconLeft}</ButtonIcon>
      ) : null}
      {children}
      {iconRight ? (
        <ButtonIcon position={ButtonIconPosition.right}>{iconRight}</ButtonIcon>
      ) : null}
    </StyledTextLink>
    );
}

