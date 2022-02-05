import { createTheme, ThemeOptions } from "@mui/material/styles";

function getThemeOptions(darkThemeActive: boolean): ThemeOptions {
  return {
    palette: {
      mode: darkThemeActive ? "dark" : "light",
    },
  };
}

export const darkTheme = createTheme(getThemeOptions(true));
export const lightTheme = createTheme(getThemeOptions(false));
