import {
  CssBaseline,
  ThemeProvider,
  StyledEngineProvider,
  Theme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "./theme";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ToggleThemeContext = React.createContext({
  toggleTheme: () => {
    console.log();
  },
  darkThemeActive: false,
});

type SelectedTheme = {
  themeName: string;
  appliedTheme: Theme;
};

const themeStorageKey = "theme";

enum ThemeName {
  DARK_THEME = "darkTheme",
  LIGHT_THEME = "lightTheme",
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}: ThemeProviderProps) => {
  const [selectedTheme, setSelectedTheme] = useState<SelectedTheme>({
    appliedTheme: darkTheme,
    themeName: ThemeName.DARK_THEME,
  });

  useEffect(() => {
    const theme = localStorage.getItem(themeStorageKey);
    if (theme && theme === ThemeName.LIGHT_THEME) {
      setSelectedTheme({
        appliedTheme: lightTheme,
        themeName: ThemeName.LIGHT_THEME,
      });
    }
  }, []);

  const toggleTheme = useCallback(() => {
    if (!selectedTheme || selectedTheme.themeName === ThemeName.DARK_THEME) {
      setSelectedTheme({
        appliedTheme: lightTheme,
        themeName: ThemeName.LIGHT_THEME,
      });
      localStorage.setItem(themeStorageKey, ThemeName.LIGHT_THEME);
    } else {
      setSelectedTheme({
        appliedTheme: darkTheme,
        themeName: ThemeName.DARK_THEME,
      });
      localStorage.setItem(themeStorageKey, ThemeName.DARK_THEME);
    }
  }, [selectedTheme, setSelectedTheme]);

  return (
    <ToggleThemeContext.Provider
      value={{
        toggleTheme,
        darkThemeActive: !(selectedTheme.themeName === ThemeName.LIGHT_THEME),
      }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={selectedTheme.appliedTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </ToggleThemeContext.Provider>
  );
};

export default CustomThemeProvider;
