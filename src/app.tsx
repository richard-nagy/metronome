import "./app.css";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Theme } from "./types/types";

export function App() {
    return (
        <ThemeProvider defaultTheme={Theme.Dark} storageKey="vite-ui-theme">
            <Layout />
        </ThemeProvider>
    );
}
