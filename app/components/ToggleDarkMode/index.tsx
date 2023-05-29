import { useCallback, useEffect, useState } from "react";
import { NavButton } from "../NavButton";
import { Icon } from "../Icons";
import styled from '@emotion/styled';

export enum ModeValue {
    light = "light-mode",
    dark = "dark-mode",
}

interface ToggleDarkModeProps {
    storageKeyId?: string;
    showBorder?: boolean;
    onToggleEnd?: (isDarkMode: boolean) => void;
}

export const ToggleDarkMode = ({
    storageKeyId,
    showBorder,
    onToggleEnd,
  }: ToggleDarkModeProps) => {
    const [isMounted, setIsMounted] = useState(false);
  
    const prefersDarkMode = typeof window !== 'undefined' ? window.matchMedia("(prefers-color-scheme: dark)") : { matches: false };
  
    const getCurrentMode = useCallback(() => {
        const modeSaved = storageKeyId && typeof localStorage !== 'undefined' ? localStorage.getItem(storageKeyId) : null;
  
      if (modeSaved) {
        return modeSaved;
      }
  
      return prefersDarkMode.matches ? ModeValue.dark : ModeValue.light;
    }, [storageKeyId, prefersDarkMode.matches]);
  
    const [isDarkMode, setIsDarkMode] = useState(
      Boolean(getCurrentMode() === ModeValue.dark),
    );
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
// Set theme on page load
    useEffect(() => {
        const currentMode = getCurrentMode();
        const _isDarkMode = Boolean(currentMode === ModeValue.dark);

        setIsDarkMode(_isDarkMode);
    }, [getCurrentMode]);

    // Set body class when value changes
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('sds-theme-light');
            document.body.classList.add('sds-theme-dark');
        } else {
            document.body.classList.remove('sds-theme-dark');
            document.body.classList.add('sds-theme-light');
        }
    }, [isDarkMode]);

    const handleToggle = () => {
        const _isDarkMode = !isDarkMode;

        setIsDarkMode(_isDarkMode);

        if (storageKeyId) {
            if (_isDarkMode) {
                localStorage.setItem(storageKeyId, ModeValue.dark);
            } else {
                localStorage.setItem(storageKeyId, ModeValue.light);
            }
        }

        if (onToggleEnd) {
            onToggleEnd(_isDarkMode);
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <NavButton
            id="dark-mode-toggle"
            title={isDarkMode ? "Activate light mode" : "Activate dark mode"}
            onClick={handleToggle}
            icon={isDarkMode ? <Icon.Sun /> : <Icon.Moon />}
            showBorder={showBorder}
        />
    );
};

ToggleDarkMode.displayName = "ToggleDarkMode";

