import { Theme } from "@/types/types";
import { createContext, useContext } from "react";

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

export const initialState: ThemeProviderState = {
    theme: Theme.System,
    setTheme: () => null,
};

export const ThemeProviderContext =
    createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
