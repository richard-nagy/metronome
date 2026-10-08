import BpmContainer from "../bpm/BpmContainer";
import { ThemeToggle } from "../ThemeToggle";

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 p-2 ml-auto flex w-full items-center justify-between bg-primary-foreground">
                <div className="flex items-center gap-2 font-medium">
                    <img
                        src="/metronome.svg"
                        alt=""
                        aria-hidden="true"
                        className="size-8"
                    />
                    <span className="text-xl">Metronome</span>
                </div>
                <ThemeToggle />
            </header>
            <main className="flex flex-1 flex-col gap-5 items-center justify-center min-w-100 pb-3">
                <BpmContainer />
            </main>
        </div>
    );
}
