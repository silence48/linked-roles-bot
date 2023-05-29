import React from "react";
import styled from '@emotion/styled';

interface NavButtonProps {
  id: string;
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  showBorder?: boolean;
}

const NavButtonStyled = styled.button<{ showBorder: boolean }>`
  --NavButton-size: 3rem;
  --NavButton-icon-size: 1.2rem;
  cursor: pointer;
  width: var(--NavButton-size);
  height: var(--NavButton-size);
  border-radius: calc(var(--NavButton-size) / 2);
  flex-shrink: 0;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: opacity var(--anim-transition-default);

  border-color: ${props => props.showBorder ? 'var(--pal-border-primary)' : 'transparent'};

  svg {
    width: var(--NavButton-icon-size);
    height: var(--NavButton-icon-size);
    fill: var(--pal-text-secondary);
  }

  &:hover {
    opacity: 0.6;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: var(--opacity-disabled-button);
  }
`;

export const NavButton: React.FC<NavButtonProps> = ({
  id,
  title,
  onClick,
  icon,
  disabled,
  showBorder,
}) => (
  <NavButtonStyled
    id={id}
    title={title}
    onClick={onClick}
    disabled={disabled}
    showBorder={showBorder ?? false}
  >
    {icon}
  </NavButtonStyled>
);

NavButton.displayName = "NavButton";
