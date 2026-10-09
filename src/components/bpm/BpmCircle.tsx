import { cn } from "@/lib/utils";
import { useEffect, useState, type CSSProperties } from "react";
import { msPerSecond, sPerMinute } from "../constants";

interface BpmCircleProps {
    text: string;
    color: string;
    first: boolean;
    active: boolean;
    bpm: number;
    subdivision: boolean;
    visible: boolean;
}

export default function BpmCircle({
    text,
    color,
    first,
    active,
    bpm,
    subdivision,
    visible,
}: BpmCircleProps) {
    const [pulse, setPulse] = useState(false);

    // Half a beat in seconds
    const pulseInterval = sPerMinute / bpm / 2;

    useEffect(() => {
        if (active) {
            setPulse(true);
            const timeout = setTimeout(
                () => setPulse(false),
                pulseInterval * msPerSecond, // Half a beat duration in milliseconds
            );
            return () => clearTimeout(timeout);
        } else {
            setPulse(false);
        }
    }, [bpm, pulseInterval, active]);

    return (
        <div
            className={cn(
                subdivision ? "size-3" : "size-12 border-2",
                "flex items-center justify-center rounded-full",
                !subdivision && "text-sm font-semibold",
                !first &&
                    !subdivision &&
                    (active ? "bg-foreground" : "bg-foreground/5"),
                subdivision && "bg-foreground/25",
                !first && !subdivision && "border-foreground",
                !first && active && "text-background",
                !visible && "invisible",
                pulse ? "pulsate-bck" : "",
                !active ? "paused" : "",
            )}
            style={
                {
                    ...(first
                        ? {
                              borderColor: color,
                              backgroundColor: active ? color : undefined,
                              color: active ? "var(--background)" : color,
                          }
                        : subdivision && active
                          ? { backgroundColor: color }
                          : {}),
                    "--pulse-duration": `${pulseInterval}s`,
                } as CSSProperties & Record<string, string>
            }
        >
            {text}
        </div>
    );
}
