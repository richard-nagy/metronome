import { Theme } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Maps a numeric value to a specific color spectrum
 * ranging from Blue-Green to Red.
 * @param value - The input number between minValue and maxValue.
 * @param minValue - The minimum value of the range.
 * @param maxValue - The maximum value of the range.
 * @param theme - The current theme, either Dark or Light.
 * @returns A CSS-compatible HSL color string.
 */
export const getColorFromRange = (
    value: number,
    minValue: number,
    maxValue: number,
    theme: Theme.Dark | Theme.Light,
): string => {
    // Handle degenerate range to avoid division by zero and invalid CSS color.
    if (maxValue === minValue) {
        // Return a default neutral color when the range has no width.
        return "hsl(0, 0%, 50%)";
    }
    const clampedValue: number = Math.max(minValue, Math.min(maxValue, value));
    const percentage: number =
        (clampedValue - minValue) / (maxValue - minValue);
    /**
     * Map percentage to Hue:
     * 0% (Value minValue)   -> Hue 180 (Blue-Green/Cyan)
     * 50% (Value midValue) -> Hue 90  (Yellow-Green)
     * 100% (Value maxValue)-> Hue 0   (Red)
     */
    const hue: number = 180 - percentage * 180;
    // Adjust lightness based on theme for better visibility.
    return `hsl(${hue}, 100%, ${theme === Theme.Dark ? 60 : 40}%)`;
};
