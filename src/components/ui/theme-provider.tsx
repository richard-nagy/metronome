import { Theme } from "@/types/types";
import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./themeHook";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

export function ThemeProvider({
    children,
    defaultTheme = Theme.System,
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
    );

    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const applyTheme = () => {
            root.classList.remove(Theme.Light, Theme.Dark);

            const resolvedTheme =
                theme === Theme.System
                    ? mediaQuery.matches
                        ? Theme.Dark
                        : Theme.Light
                    : theme;

            root.classList.add(resolvedTheme);
        };

        applyTheme();

        if (theme !== Theme.System) {
            return;
        }

        mediaQuery.addEventListener("change", applyTheme);
        return () => mediaQuery.removeEventListener("change", applyTheme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
