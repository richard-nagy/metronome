import "./app.css";
import { ThemeToggle } from "./components/ThemeToggle";
import { Theme, ThemeProvider } from "./components/ui/theme-provider";

export function App() {
    return (
        <ThemeProvider defaultTheme={Theme.Dark} storageKey="vite-ui-theme">
            <ThemeToggle />
        </ThemeProvider>
    );
}
