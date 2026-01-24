import "./app.css";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Theme } from "./lib/types";

export function App() {
    return (
        <ThemeProvider defaultTheme={Theme.Dark} storageKey="vite-ui-theme">
            <Layout />
        </ThemeProvider>
    );
}
