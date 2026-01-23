import "./app.css";
import { ModeToggle } from "./components/ModeToggle";
import { Button } from "./components/ui/button";
import { Theme, ThemeProvider } from "./components/ui/theme-provider";

export function App() {
    return (
        <ThemeProvider defaultTheme={Theme.Dark} storageKey="vite-ui-theme">
            <Button>Click Me</Button>
            <ModeToggle />
        </ThemeProvider>
    );
}
