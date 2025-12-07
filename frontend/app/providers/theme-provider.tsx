"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { useState, createContext, useContext } from "react";
import { lightTheme, darkTheme } from "../theme/theme";

const ThemeToggleContext = createContext({
  toggle: () => {},
});

export const useThemeToggle = () => useContext(ThemeToggleContext);

export default function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggle = () => setMode(mode === "light" ? "dark" : "light");

  return (
    <ThemeToggleContext.Provider value={{ toggle }}>
      <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}
