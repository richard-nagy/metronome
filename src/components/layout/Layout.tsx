import BpmContainer from "../bpm/BpmContainer";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import packageJson from "../../../package.json";

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 p-2 ml-auto flex w-full items-center justify-between bg-primary-foreground">
                <div className="flex items-center gap-2 font-medium">
                    <img
                        src={`${import.meta.env.BASE_URL}metronome.svg`}
                        alt=""
                        className="size-8"
                    />
                    <h1 className="text-xl">Metronome</h1>
                    <span
                        className="text-xs text-muted-foreground pt-1"
                        aria-label={`Version ${packageJson.version}`}
                        title={`Version ${packageJson.version}`}
                    >
                        v{packageJson.version}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild size="icon" variant="ghost">
                        <a
                            href="https://github.com/richard-nagy/metronome"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View project on GitHub"
                            title="View project on GitHub"
                        >
                            <ExternalLink className="size-5" />
                        </a>
                    </Button>
                    <ThemeToggle />
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-5 items-center justify-center min-w-75 mb-10">
                <BpmContainer />
            </main>
        </div>
    );
}
