/*
<div>
      <ButtonIcon position={ButtonIconPosition.left}>
        <YourIcon />
      </ButtonIcon>
    </div>
    */
import React from 'react';
import styled from '@emotion/styled';

export enum ButtonIconPosition {
  left = 'left',
  right = 'right',
}

interface ButtonIconProps {
  position: ButtonIconPosition;
  children: React.ReactNode;
}

const StyledButtonIcon = styled.span<ButtonIconProps>`
  display: block;
  width: 1rem;
  height: 1rem;
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;

  --ButtonIcon-gap: 0.5rem;

  margin-right: ${props => props.position === ButtonIconPosition.left ? 'var(--ButtonIcon-gap)' : '0'};
  margin-left: ${props => props.position === ButtonIconPosition.right ? 'var(--ButtonIcon-gap)' : '0'};

  svg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    fill: inherit;
  }
`;

export const ButtonIcon: React.FC<ButtonIconProps> & { Position: typeof ButtonIconPosition } = ({ position, children }) => (
  <StyledButtonIcon position={position}>{children}</StyledButtonIcon>
);

ButtonIcon.displayName = 'ButtonIcon';
ButtonIcon.Position = ButtonIconPosition;
