import BpmContainer from "../bpm/BpmContainer";
import { ThemeToggle } from "../ThemeToggle";

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 p-2 ml-auto">
                <ThemeToggle />
            </header>
            <main className="flex flex-1 flex-col gap-5 items-center justify-center min-w-100">
                <BpmContainer />
            </main>
        </div>
    );
}
