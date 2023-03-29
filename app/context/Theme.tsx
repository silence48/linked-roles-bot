import React, { type ReactElement, type FunctionComponent } from 'react';

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'midnight';

type ThemeProviderProps = { children: ReactElement }

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>(
  {} as ThemeContextType
);

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = React.useState(THEME_DARK);

  const toggleTheme = () => {
    setTheme(theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  return React.useContext(ThemeContext);
};
