import { useEffect, useState } from "react";
import { useTheme } from "@/components/ui/themeHook";
import { Theme } from "@/types/types";

/**
 * Returns the effective theme: "dark" or "light".
 * If the user selected "system", resolves to the current system preference.
 */
export function useResolvedTheme(): Theme.Dark | Theme.Light {
    const { theme } = useTheme();
    const [resolved, setResolved] = useState<Theme.Dark | Theme.Light>(
        Theme.Light,
    );

    useEffect(() => {
        if (theme === Theme.System) {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            const getSystemTheme = () =>
                mq.matches ? Theme.Dark : Theme.Light;
            setResolved(getSystemTheme());
            const handler = () => setResolved(getSystemTheme());
            mq.addEventListener("change", handler);
            return () => mq.removeEventListener("change", handler);
        } else {
            setResolved(theme);
        }
    }, [theme]);

    return resolved;
}
