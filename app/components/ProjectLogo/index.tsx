import React from 'react';
import styled from '@emotion/styled';
import { Logo } from '../Logos';

const StyledProjectLogo = styled.div`
  display: flex;
  align-items: center;

  a {
    display: block;
    overflow: hidden;
    height: 1.5rem;
    width: 1.9rem;
    margin-right: 0.75rem;
    flex-shrink: 0;

    @media (min-width: 600px) {
      width: 6rem;
    }

    svg {
      height: 100%;
      width: 6rem;
      fill: var(--pal-text-primary);
    }
  }
`;

const ProjectLogoTitle = styled.div`
  background-color: var(--pal-brand-primary);
  color: var(--pal-brand-primary-on);
  text-transform: uppercase;
  font-size: 0.875rem;
  line-height: 1.125rem;
  font-weight: var(--font-weight-medium);
  padding: 0.2rem 0.375rem;
  border-radius: 0.25rem;
`;

interface ProjectLogoProps {
  title: string;
  link?: string;
}

export const ProjectLogo: React.FC<ProjectLogoProps> = ({ title, link = '/' }) => (
  <StyledProjectLogo>
    <a href={link} rel="noreferrer noopener">
      <Logo.Stellar />
    </a>
    <ProjectLogoTitle>{title}</ProjectLogoTitle>
  </StyledProjectLogo>
);

ProjectLogo.displayName = 'ProjectLogo';
