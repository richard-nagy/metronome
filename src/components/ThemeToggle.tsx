import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Theme, useTheme } from "./ui/theme-provider";

export function ThemeToggle() {
    const { setTheme } = useTheme();

    const [position, setPosition] = useState("system");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={(value) => {
                        setPosition(value);
                        setTheme(value as Theme);
                    }}
                >
                    <DropdownMenuRadioItem value={Theme.System}>
                        System
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={Theme.Light}>
                        Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={Theme.Dark}>
                        Dark
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
