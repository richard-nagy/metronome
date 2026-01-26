import { ThemeToggle } from "../ThemeToggle";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 p-2 ml-auto">
            <ThemeToggle />
        </header>
    );
}
